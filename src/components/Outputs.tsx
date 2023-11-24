import { FC, Dispatch, SetStateAction, MutableRefObject } from "react";

interface OutputProps {
  outputs: MIDIOutput[] | undefined;
  selectedOutput: string | undefined;
  setSelectedOutput: Dispatch<SetStateAction<string | undefined>>;
  midi: MutableRefObject<MIDIAccess | undefined>;
}

export const Outputs: FC<OutputProps> = ({
  outputs,
  selectedOutput,
  setSelectedOutput,
  midi,
}) => {
  const handleSelectOutput = (id: string) => {
    if (!midi.current) return;
    const output = midi.current.outputs.get(id);
    if (!output) return;
    output.open();
    setSelectedOutput(id);
  };

  if (!outputs?.length) return null;
  return (
    <div className="list">
      <h3>Outputs:</h3>
      <div className="list">
        {outputs?.map((output, index) => (
          <div key={index} className="item">
            <button
              className={selectedOutput === output.id ? "selected" : ""}
              onClick={() => handleSelectOutput(output.id)}
            >
              {output.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
