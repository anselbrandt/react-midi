import { useEffect, useRef, useState } from "react";
import "./App.css";
import { getChord } from "./chords";
import { Logo, Inputs, Outputs, Piano, Toggle } from "./components";
import { useMidiDevices } from "./hooks";

function App() {
  const midi = useRef<MIDIAccess>();
  const { inputs, outputs } = useMidiDevices(midi);
  const [selectedInput, setSelectedInput] = useState<string>();
  const [selectedOutput, setSelectedOutput] = useState<string>();
  const [activeNotes, setActiveNotes] = useState<number[]>();
  const [chordNotes, setChordNotes] = useState<number[]>();
  const [disabled, setDisabled] = useState(false);

  const handleChange = () => setDisabled((prev) => !prev);

  useEffect(() => {
    if (!midi.current) return;
    Array.from(midi.current.inputs).forEach((input) => {
      input[1].onmidimessage = (msg: any) => {
        if (msg.currentTarget?.id !== selectedInput) return;
        if (!selectedOutput || !midi.current) return;
        const output = midi.current.outputs.get(selectedOutput);
        output?.send(msg.data);
        const [status, note, velocity] = msg.data;
        const noteOn = status === 144;
        const noteOff = status === 128;
        // const afterTouch = status === 208
        if (noteOn) {
          const chord = getChord({ note, disabled });
          setChordNotes(chord);
          setActiveNotes((prev) => (prev ? [...prev, ...chord] : chord));
        }
        if (noteOff) {
          chordNotes?.forEach((chordNote) =>
            output?.send([128, chordNote, velocity])
          );
          setActiveNotes([]);
          setChordNotes([]);
        }
      };
    });
  }, [selectedInput, selectedOutput, disabled]);

  return (
    <div>
      <Logo />
      <Inputs
        inputs={inputs}
        selectedInput={selectedInput}
        setSelectedInput={setSelectedInput}
        midi={midi}
      />
      <Outputs
        outputs={outputs}
        selectedOutput={selectedOutput}
        setSelectedOutput={setSelectedOutput}
        midi={midi}
      />
      <div className="list">
        <h3>Options:</h3>
        <div className="list">
          <button className="item">Major</button>
          <button className="item">Minor</button>
          <button className="item">Inversion</button>
          <button className="item">I</button>
          <button className="item">III</button>
          <button className="item">V</button>
          <button className="item">Extended</button>
          <button className="item">5th</button>
          <button className="item">7th</button>
          <button className="item">9th</button>
          <button className="item">11th</button>
        </div>
      </div>
      <Piano
        activeNotes={activeNotes}
        selectedOutput={selectedOutput}
        midi={midi}
      />
      Disable Chord Generator:
      <Toggle checked={disabled} handleChange={handleChange} />
    </div>
  );
}

export default App;
