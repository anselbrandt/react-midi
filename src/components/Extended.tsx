import { FC } from "react";

interface ExtendedProps {
  selectedExtension: number;
  handleSelectExtension: (ext: number) => void;
}

export const Extended: FC<ExtendedProps> = ({
  selectedExtension,
  handleSelectExtension,
}) => {
  return (
    <div className="card">
      {[5, 7, 9, 11].map((ext, index) => (
        <button
          key={index}
          className="round"
          onClick={() => handleSelectExtension(ext)}
          style={{
            backgroundColor: selectedExtension === ext ? "cornflowerblue" : "",
          }}
        >
          {ext}
        </button>
      ))}
    </div>
  );
};
