import midiLogo from "/webmidijs.svg";
import "./App.css";

function App() {
  return (
    <>
      <div>
        <a href="https://webmidijs.org/" target="_blank">
          <img src={midiLogo} className="logo midi" alt="Web MIDI logo" />
        </a>
      </div>
      <div className="card">
        <button>Button</button>
      </div>
    </>
  );
}

export default App;
