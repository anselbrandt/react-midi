import midiLogo from "/webmidijs.svg";
import "./App.css";
import { useEffect, useRef, useState } from "react";

function App() {
  const midi = useRef<MIDIAccess>();
  const [inputs, setInputs] = useState<MIDIInput[]>();
  const [outputs, setOutputs] = useState<MIDIOutput[]>();
  const [selectedInput, setSelectedInput] = useState<string>();
  const [selectedOutput, setSelectedOutput] = useState<string>();

  const handleClick = async () => {
    if (midi.current) return;
    const midiAccess = await navigator.requestMIDIAccess({ sysex: false });
    midi.current = midiAccess;
    const inputValues = Array.from(midi.current.inputs.values());
    setInputs(inputValues);
    const outputValues = Array.from(midi.current.outputs.values());
    setOutputs(outputValues);
    console.log({ inputValues, outputValues });
  };

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

  const handleGetStatus = () => {
    if (!midi.current) return;
    const inputValues = Array.from(midi.current.inputs.values());
    const outputValues = Array.from(midi.current.outputs.values());
    console.log({ inputValues, outputValues });
  };

  useEffect(() => {
    navigator.requestMIDIAccess().then((midiAccess) => {
      Array.from(midiAccess.inputs).forEach((input) => {
        input[1].onmidimessage = (msg: any) => {
          if (msg.currentTarget?.id !== selectedInput) return;
          const [status, note, velocity] = msg.data;
          const noteOn = status === 144 ? "noteOn" : null;
          const noteOff = status === 128 ? "noteOff" : null;
          const afterTouch = status === 208 ? "afterToouch" : null;
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
      <div>Input: {selectedInput}</div>
      <div>Output: {selectedOutput}</div>
      <div className="card">
        <button onClick={handleClick}>click</button>
      </div>
      <div className="card">
        <button onClick={handleGetStatus}>status</button>
      </div>
      <h3>Inputs:</h3>
      {inputs?.map((input, index) => (
        <div key={index} onClick={() => handleSelectInput(input.id)}>
          {input.name}: {input.id}
        </div>
      ))}
      <h3>Outputs:</h3>
      {outputs?.map((output, index) => (
        <div key={index} onClick={() => handleSelectOutput(output.id)}>
          {output.name}: {output.id}
        </div>
      ))}
    </>
  );
}

export default App;
