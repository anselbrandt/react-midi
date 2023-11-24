import { FC } from "react";
import "./Toggle.css";

interface ToggleProps {
  checked: boolean;
  handleChange: () => void;
}

export const Toggle: FC<ToggleProps> = ({ checked, handleChange }) => {
  return (
    <label className="switch">
      <input type="checkbox" onChange={handleChange} checked={checked} />
      <span className="slider round"></span>
    </label>
  );
};
