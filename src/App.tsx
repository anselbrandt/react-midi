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
  const [isHarmonize, setIsHarmonize] = useState(true);

  const handleChange = () => setIsHarmonize((prev) => !prev);

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
          const chord = getChord(note, isHarmonize);
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
  }, [selectedInput, selectedOutput, isHarmonize]);

  return (
    <>
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
      <Piano
        activeNotes={activeNotes}
        selectedOutput={selectedOutput}
        midi={midi}
      />
      <div>
        Harmononize:{" "}
        <Toggle checked={isHarmonize} handleChange={handleChange} />
      </div>
    </>
  );
}

export default App;
