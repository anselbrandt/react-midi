import { useEffect, useRef, useState } from "react";
import "./App.css";
import { getChord } from "./chords";
import { Logo, Inputs, Outputs, Piano } from "./components";
import { useMidi } from "./hooks";

function App() {
  const midi = useRef<MIDIAccess>();
  const { inputs, outputs } = useMidi(midi);
  const [selectedInput, setSelectedInput] = useState<string>();
  const [selectedOutput, setSelectedOutput] = useState<string>();
  const [activeNotes, setActiveNotes] = useState<number[]>();
  const [chordNotes, setChordNotes] = useState<number[]>();

  const handleSelectInput = (id: string) => {
    if (!midi.current) return;
    const input = midi.current.inputs.get(id);
    if (!input) return;
    input.open();
    setSelectedInput(id);
  };

  const handleSelectOutput = (id: string) => {
    if (!midi.current) return;
    const output = midi.current.outputs.get(id);
    if (!output) return;
    output.open();
    setSelectedOutput(id);
  };

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
          const chord = getChord(note);
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
  }, [selectedInput, selectedOutput]);

  return (
    <>
      <Logo />
      <Inputs
        inputs={inputs}
        selectedInput={selectedInput}
        handleSelectInput={handleSelectInput}
      />
      <Outputs
        outputs={outputs}
        selectedOutput={selectedOutput}
        handleSelectOutput={handleSelectOutput}
      />
      <Piano
        activeNotes={activeNotes}
        selectedOutput={selectedOutput}
        midi={midi}
      />
    </>
  );
}

export default App;
