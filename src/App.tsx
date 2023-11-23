import { useEffect, useRef, useState } from "react";
import midiLogo from "/webmidijs.svg";
import "./App.css";
import { Piano, KeyboardShortcuts, MidiNumbers } from "react-piano";
import "react-piano/dist/styles.css";

function App() {
  const midi = useRef<MIDIAccess>();
  const [inputs, setInputs] = useState<MIDIInput[]>();
  const [outputs, setOutputs] = useState<MIDIOutput[]>();
  const [selectedInput, setSelectedInput] = useState<string>();
  const [selectedOutput, setSelectedOutput] = useState<string>();

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
    navigator.requestMIDIAccess().then((midiAccess) => {
      Array.from(midiAccess.inputs).forEach((input) => {
        input[1].onmidimessage = (msg: any) => {
          // if (msg.currentTarget?.id !== selectedInput) return;
          const [status, note, velocity] = msg.data;
          const noteOn = status === 144 ? "noteOn" : null;
          const noteOff = status === 128 ? "noteOff" : null;
          const afterTouch = status === 208 ? "afterTouch" : null;
          console.log(noteOn || noteOff || afterTouch, {
            status,
            note,
            velocity,
          });
        };
      });
    });
  });

  return (
    <>
      <div>
        <a href="https://webmidijs.org/" target="_blank">
          <img src={midiLogo} className="logo midi" alt="Web MIDI logo" />
        </a>
      </div>

      <Piano
        noteRange={{ first: firstNote, last: lastNote }}
        playNote={(midiNumber: any) => {
          console.log({ midiNumber });
        }}
        stopNote={(midiNumber: any) => {
          console.log({ midiNumber });
        }}
        width={1000}
        keyboardShortcuts={keyboardShortcuts}
      />

      <h3>Inputs:</h3>
      {inputs?.map((input, index) => (
        <div key={index}>
          <button
            className={selectedInput === input.id ? "selected" : ""}
            onClick={() => handleSelectInput(input.id)}
          >
            {input.name}
          </button>
        </div>
      ))}
      <h3>Outputs:</h3>
      {outputs?.map((output, index) => (
        <div key={index}>
          <button
            className={selectedOutput === output.id ? "selected" : ""}
            onClick={() => handleSelectOutput(output.id)}
          >
            {output.name}
          </button>
        </div>
      ))}
    </>
  );
}

export default App;
