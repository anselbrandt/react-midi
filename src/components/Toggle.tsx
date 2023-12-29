import { FC, ReactNode } from "react";
import "./Toggle.css";

interface ToggleProps {
  checked: boolean;
  handleChange: () => void;
  children?: ReactNode;
}

export const Toggle: FC<ToggleProps> = ({
  checked,
  handleChange,
  children,
}) => {
  return (
    <>
      <span className="text">{children}</span>
      <label className="switch">
        <input type="checkbox" onChange={handleChange} checked={checked} />
        <span className="slider rounded"></span>
      </label>
    </>
  );
};
