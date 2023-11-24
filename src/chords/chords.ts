interface Options {
  note: number;
  disabled: boolean;
  major: boolean;
  inversion: string;
  extended: number;
}

const getInitial = (note: number, major: boolean) => {
  if (!major) return [note, note + 3, note + 7];
  return [note, note + 4, note + 7];
};

const getExtended = (chord: number[], extended: number) => {
  switch (extended) {
    case 0:
      return chord;
    case 7:
      return [chord[0], chord[1], chord[0] + 10];
    case 9:
      return [chord[1], chord[2], chord[0] + 14];
    case 11:
      return [chord[1], chord[2], chord[0] + 16];
    default:
      return chord;
  }
};

const getInversion = (chord: number[], inversion: string) => {
  switch (inversion) {
    case "i":
      return chord;
    case "iii":
      return [chord[1], chord[2], chord[0] + 12];
    case "v":
      return [chord[2] - 12, chord[0], chord[1]];
    default:
      return chord;
  }
};

export const getChord = ({
  note,
  disabled,
  major = true,
  inversion,
  extended,
}: Options) => {
  if (disabled) return [note];
  const initial = getInitial(note, major);
  const extendedChord = getExtended(initial, extended);
  const inverted = getInversion(extendedChord, inversion);
  return inverted;
};
