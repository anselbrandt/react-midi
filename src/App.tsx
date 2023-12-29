import { useEffect, useRef, useState } from "react";
import "./App.css";
import {
  Logo,
  Inputs,
  Outputs,
  Piano,
  Sound,
  TonalSelector,
  Extended,
} from "./components";
import { useMidiDevices } from "./hooks";
import { ElectricPiano } from "smplr";
import { getChord } from "./chords";

function App() {
  let epiano = useRef<ElectricPiano | null>();
  const [isSound, setIsSound] = useState(false);
  const midi = useRef<MIDIAccess>();
  const { inputs, outputs } = useMidiDevices(midi);
  const [selectedInput, setSelectedInput] = useState<string>();
  const [selectedOutput, setSelectedOutput] = useState<string>();
  const [activeNotes, setActiveNotes] = useState<number[]>([]);
  const [notesOn, setNotesOn] = useState<number[]>([]);
  const [activeSamples, setActiveSamples] = useState<number[]>([]);
  const [selectedKey, setSelectedKey] = useState("C");
  const [selectedExtension, setSelectedExtension] = useState(5);
  const [chordNotes, setChordNotes] = useState<number[]>([]);

  const handleInit = () => {
    if (epiano.current) return;
    epiano.current = new ElectricPiano(new AudioContext(), {
      instrument: "PianetT",
    });
  };

  const handleSound = () => {
    if (epiano.current) epiano.current = null;
    if (!epiano.current) handleInit();
    setIsSound((prev) => !prev);
  };

  const handleSelectKey = (key: string) => {
    setSelectedKey(key);
  };

  const handleSelectExtension = (ext: number) => {
    setSelectedExtension(ext);
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
    if (epiano.current) {
      if (activeSamples.includes(note)) return;
      setActiveSamples((prev) => [...prev, note]);
      const chord = getChord({
        note,
        extension: selectedExtension,
        key: selectedKey,
      });
      setChordNotes(chord);
      chord.forEach((chordNote) => {
        if (epiano.current) epiano.current.start(chordNote);
      });
    }
    if (!midi.current || !selectedOutput) return;
    if (notesOn.includes(note)) return;
    setNotesOn((prev) => [...prev, note]);
    const output = midi.current.outputs.get(selectedOutput);
    output?.send([144, note, 60]);
  };

  const onStopNoteInput = (note: number) => {
    if (epiano.current) {
      setActiveSamples((prev) =>
        [...prev].filter((prevNote) => prevNote !== note)
      );
      chordNotes.forEach((chordNote) => {
        if (epiano.current) epiano.current.stop(chordNote);
      });
      setChordNotes([]);
    }
    if (!midi.current || !selectedOutput) return;
    setNotesOn((prev) => [...prev].filter((prevNote) => prevNote !== note));
    const output = midi.current.outputs.get(selectedOutput);
    output?.send([128, note, 0]);
  };

  return (
    <>
      <Logo />
      <Sound isSound={isSound} handleSound={handleSound} />
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
      <TonalSelector
        selectedKey={selectedKey}
        handleSelectKey={handleSelectKey}
      />
      <Extended
        selectedExtension={selectedExtension}
        handleSelectExtension={handleSelectExtension}
      />
    </>
  );
}

export default App;
