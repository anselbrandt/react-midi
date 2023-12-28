import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Logo, Inputs, Outputs, Piano } from "./components";
import { useMidiDevices } from "./hooks";

function App() {
  const midi = useRef<MIDIAccess>();
  const { inputs, outputs } = useMidiDevices(midi);
  const [selectedInput, setSelectedInput] = useState<string>();
  const [selectedOutput, setSelectedOutput] = useState<string>();
  const [activeNotes, setActiveNotes] = useState<number[]>([]);
  const [notesOn, setNotesOn] = useState<number[]>([]);

  useEffect(() => {
    if (!midi.current) return;
    Array.from(midi.current.inputs).forEach((input) => {
      input[1].onmidimessage = (msg: any) => {
        if (msg.currentTarget?.id !== selectedInput) return;
        if (!selectedOutput || !midi.current) return;
        const output = midi.current.outputs.get(selectedOutput);
        output?.send(msg.data);
        const [status, note, velocity] = msg.data;
        const activeSense = status === 254;
        if (activeSense) return;
        const noteOn = status === 144;
        const noteOff = status === 128 || velocity === 0;
        // const afterTouch = status === 208;
        if (noteOn)
          setActiveNotes((prev) => {
            if (prev.includes(note)) return prev;
            return [...prev, note];
          });
        if (noteOff)
          setActiveNotes((prev) =>
            [...prev].filter((prevNote) => prevNote !== note)
          );
      };
    });
  }, [selectedInput, selectedOutput]);

  const onPlayNoteInput = (note: number) => {
    if (!midi.current || !selectedOutput) return;
    if (notesOn.includes(note)) return;
    setNotesOn((prev) => [...prev, note]);
    const output = midi.current.outputs.get(selectedOutput);
    output?.send([144, note, 60]);
  };

  const onStopNoteInput = (note: number) => {
    if (!midi.current || !selectedOutput) return;
    setNotesOn((prev) => [...prev].filter((prevNote) => prevNote !== note));
    const output = midi.current.outputs.get(selectedOutput);
    output?.send([128, note, 0]);
  };

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
        onPlayNoteInput={onPlayNoteInput}
        onStopNoteInput={onStopNoteInput}
      />
    </>
  );
}

export default App;
