import { FC } from "react";

interface TonalSelectorProps {
  selectedKey: string;
  handleSelectKey: (str: string) => void;
}

export const TonalSelector: FC<TonalSelectorProps> = ({
  selectedKey,
  handleSelectKey,
}) => {
  return (
    <div className="card">
      <div>
        {["C#", "Eb", "F#", "G#", "Bb"].map((key, index) => (
          <button
            key={index}
            className="round"
            onClick={() => handleSelectKey(key)}
            style={{
              backgroundColor: selectedKey === key ? "cornflowerblue" : "",
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
            onClick={() => handleSelectKey(key)}
            style={{
              backgroundColor: selectedKey === key ? "cornflowerblue" : "",
            }}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
};
