import { FC } from "react";

interface SoundProps {
  isSound: boolean;
  handleSound: () => void;
}

export const Sound: FC<SoundProps> = ({ isSound, handleSound }) => {
  return (
    <div className="list">
      <h3>Sound:</h3>
      <div className="list">
        <div className="item">
          <button className={isSound ? "selected" : ""} onClick={handleSound}>
            {isSound ? "On" : "Off"}
          </button>
        </div>
      </div>
    </div>
  );
};
