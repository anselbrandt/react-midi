import { FC } from "react";

interface TonalSelectorProps {
  selectedTone: string;
  handleSelectTone: (str: string) => void;
}

export const TonalSelector: FC<TonalSelectorProps> = ({
  selectedTone,
  handleSelectTone,
}) => {
  return (
    <div>
      <div>
        {["C#", "Eb", "F#", "G#", "Bb"].map((key, index) => (
          <button
            key={index}
            className="round"
            onClick={() => handleSelectTone(key)}
            style={{
              backgroundColor: selectedTone === key ? "cornflowerblue" : "",
              marginRight: key === "F#" ? 50 : "",
            }}
          >
            {key}
          </button>
        ))}
      </div>
      <div>
        {["C", "D", "E", "F", "G", "A", "B"].map((key, index) => (
          <button
            key={index}
            className="round"
            onClick={() => handleSelectTone(key)}
            style={{
              backgroundColor: selectedTone === key ? "cornflowerblue" : "",
            }}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
};
