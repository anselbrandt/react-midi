import midiLogo from "/webmidijs.svg";

export const Logo = () => {
  return (
    <div className="center">
      <a href="https://webmidijs.org/" target="_blank">
        <img src={midiLogo} className="logo midi" alt="Web MIDI logo" />
      </a>
    </div>
  );
};
