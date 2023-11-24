import { FC, Dispatch, SetStateAction } from "react";

interface OptionsProps {
  major: boolean;
  setMajor: Dispatch<SetStateAction<boolean>>;
  inversion: string;
  setInversion: Dispatch<SetStateAction<string>>;
  extended: number;
  setExtended: Dispatch<SetStateAction<number>>;
}

export const Options: FC<OptionsProps> = ({
  major,
  setMajor,
  inversion,
  setInversion,
  extended,
  setExtended,
}) => {
  return (
    <>
      <h3>Options:</h3>
      <div className="list">
        <button
          className={`item ${major ? "selected" : ""}`}
          onClick={() => setMajor(true)}
        >
          Major
        </button>
        <button
          className={`item ${!major ? "selected" : ""}`}
          onClick={() => setMajor(false)}
        >
          Minor
        </button>
      </div>
      <div className="list">
        <button
          className={`item ${inversion !== "i" ? "selected" : ""}`}
          onClick={() => setInversion("i")}
        >
          Inversion
        </button>
        <button
          className={`item ${inversion === "i" ? "selected" : ""}`}
          onClick={() => setInversion("i")}
        >
          I
        </button>
        <button
          className={`item ${inversion === "iii" ? "selected" : ""}`}
          onClick={() => setInversion("iii")}
        >
          III
        </button>
        <button
          className={`item ${inversion === "v" ? "selected" : ""}`}
          onClick={() => setInversion("v")}
        >
          V
        </button>
      </div>
      <div className="list">
        <button
          className={`item ${extended !== 0 ? "selected" : ""}`}
          onClick={() => setExtended(0)}
        >
          Extended
        </button>
        <button
          className={`item ${extended === 5 ? "selected" : ""}`}
          onClick={() => setExtended(5)}
        >
          5th
        </button>
        <button
          className={`item ${extended === 7 ? "selected" : ""}`}
          onClick={() => setExtended(7)}
        >
          7th
        </button>
        <button
          className={`item ${extended === 9 ? "selected" : ""}`}
          onClick={() => setExtended(9)}
        >
          9th
        </button>
        <button
          className={`item ${extended === 11 ? "selected" : ""}`}
          onClick={() => setExtended(11)}
        >
          11th
        </button>
      </div>
    </>
  );
};
