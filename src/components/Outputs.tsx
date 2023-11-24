import { FC } from "react";

interface OutputProps {
  outputs: MIDIOutput[] | undefined;
  selectedOutput: string | undefined;
  handleSelectOutput: (id: string) => void;
}

export const Outputs: FC<OutputProps> = ({
  outputs,
  selectedOutput,
  handleSelectOutput,
}) => {
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
