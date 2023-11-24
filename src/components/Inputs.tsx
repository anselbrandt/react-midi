import { FC } from "react";

interface InputProps {
  inputs: MIDIInput[] | undefined;
  selectedInput: string | undefined;
  handleSelectInput: (id: string) => void;
}

export const Inputs: FC<InputProps> = ({
  inputs,
  selectedInput,
  handleSelectInput,
}) => {
  if (!inputs?.length) return null;

  return (
    <div className="list">
      <h3>Inputs:</h3>
      <div className="list">
        {inputs?.map((input, index) => (
          <div key={index} className="item">
            <button
              className={selectedInput === input.id ? "selected" : ""}
              onClick={() => handleSelectInput(input.id)}
            >
              {input.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
