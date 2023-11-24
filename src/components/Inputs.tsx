import { FC, Dispatch, SetStateAction, MutableRefObject } from "react";

interface InputProps {
  inputs: MIDIInput[] | undefined;
  selectedInput: string | undefined;
  setSelectedInput: Dispatch<SetStateAction<string | undefined>>;
  midi: MutableRefObject<MIDIAccess | undefined>;
}

export const Inputs: FC<InputProps> = ({
  inputs,
  selectedInput,
  setSelectedInput,
  midi,
}) => {
  const handleSelectInput = (id: string) => {
    if (!midi.current) return;
    const input = midi.current.inputs.get(id);
    if (!input) return;
    input.open();
    setSelectedInput(id);
  };

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
