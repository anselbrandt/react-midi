import { FC, MutableRefObject } from "react";
import {
  Piano as ReactPiano,
  KeyboardShortcuts,
  MidiNumbers,
} from "react-piano";
import "react-piano/dist/styles.css";

interface PianoProps {
  activeNotes: number[] | undefined;
  selectedOutput: string | undefined;
  midi: MutableRefObject<MIDIAccess | undefined>;
}

export const Piano: FC<PianoProps> = ({
  activeNotes,
  selectedOutput,
  midi,
}) => {
  const firstNote = MidiNumbers.fromNote("c3");
  const lastNote = MidiNumbers.fromNote("f5");
  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: firstNote,
    lastNote: lastNote,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
  });

  const handleNoteOn = (note: number) => {
    if (!selectedOutput || !midi.current) return;
    const output = midi.current.outputs.get(selectedOutput);
    output?.send([144, note, 60]);
  };

  const handleNoteOff = (note: number) => {
    if (!selectedOutput || !midi.current) return;
    const output = midi.current.outputs.get(selectedOutput);
    output?.send([128, note, 0]);
  };

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
