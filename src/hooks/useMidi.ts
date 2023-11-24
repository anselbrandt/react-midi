import { useState, useEffect, MutableRefObject } from "react";

export const useMidi = (midi: MutableRefObject<MIDIAccess | undefined>) => {
  const [inputs, setInputs] = useState<MIDIInput[]>();
  const [outputs, setOutputs] = useState<MIDIOutput[]>();
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
  return { inputs, outputs };
};
