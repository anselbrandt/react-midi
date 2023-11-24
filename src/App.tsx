import { FC, useEffect, useRef, useState } from "react";
import "./App.css";
import { Piano, KeyboardShortcuts, MidiNumbers } from "react-piano";
import "react-piano/dist/styles.css";
import { getChord } from "./chords";
import { Inputs, Outputs, Logo } from "./components";

function App() {
  const midi = useRef<MIDIAccess>();
  const [inputs, setInputs] = useState<MIDIInput[]>();
  const [outputs, setOutputs] = useState<MIDIOutput[]>();
  const [selectedInput, setSelectedInput] = useState<string>();
  const [selectedOutput, setSelectedOutput] = useState<string>();
  const [activeNotes, setActiveNotes] = useState<number[]>();
  const [chordNotes, setChordNotes] = useState<number[]>();

  const firstNote = MidiNumbers.fromNote("c3");
  const lastNote = MidiNumbers.fromNote("f5");
  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: firstNote,
    lastNote: lastNote,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
  });

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

  const handleNoteOn = (note: number) => {
    if (!selectedOutput || !midi.current) return;
    const output = midi.current.outputs.get(selectedOutput);
    output?.send([144, note, 60]);
  };

  const handleNoteOff = (note: number) => {
    if (!selectedOutput || !midi.current) return;
    const output = midi.current.outputs.get(selectedOutput);
    output?.send([128, note, 0]);
  };

  useEffect(() => {
    const init = async () => {
      if (midi.current) return;
      const midiAccess = await navigator.requestMIDIAccess({ sysex: false });
      midi.current = midiAccess;
      const inputValues = Array.from(midi.current.inputs.values());
      setInputs(inputValues);
      const outputValues = Array.from(midi.current.outputs.values());
      setOutputs(outputValues);
    };
    init();
  }, []);

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
        noteRange={{ first: firstNote, last: lastNote }}
        playNote={(note: number) => {
          handleNoteOn(note);
        }}
        stopNote={(note: number) => {
          handleNoteOff(note);
        }}
        width={1000}
        keyboardShortcuts={keyboardShortcuts}
        activeNotes={activeNotes}
      />
    </>
  );
}

export default App;
