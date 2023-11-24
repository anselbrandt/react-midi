import { FC } from "react";
import {
  Piano as ReactPiano,
  KeyboardShortcuts,
  MidiNumbers,
} from "react-piano";
import "react-piano/dist/styles.css";

interface PianoProps {
  handleNoteOn: (note: number) => void;
  handleNoteOff: (note: number) => void;
  activeNotes: number[] | undefined;
}

export const Piano: FC<PianoProps> = ({
  handleNoteOn,
  handleNoteOff,
  activeNotes,
}) => {
  const firstNote = MidiNumbers.fromNote("c3");
  const lastNote = MidiNumbers.fromNote("f5");
  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: firstNote,
    lastNote: lastNote,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
  });

  return (
    <ReactPiano
      noteRange={{ first: firstNote, last: lastNote }}
      playNote={(note: number) => {
        handleNoteOn(note);
      }}
      stopNote={(note: number) => {
        handleNoteOff(note);
      }}
      width={1000}
      keyboardShortcuts={keyboardShortcuts}
      activeNotes={activeNotes}
    />
  );
};
