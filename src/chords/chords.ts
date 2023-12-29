interface Options {
  note: number;
  extension: number;
  key: string;
  disabled: boolean;
}

const keyMap: Record<string, number> = {
  C: 60,
  "C#": 61,
  D: 62,
  Eb: 63,
  E: 64,
  F: 65,
  "F#": 66,
  G: 67,
  "G#": 68,
  A: 69,
  Bb: 70,
  B: 71,
};

const inversionMap: Record<number, number> = {
  48: 0,
  50: 1,
  52: 2,
  53: 3,
  55: 4,
  57: 5,
  59: 6,
};

const getInverted = (chord: number[], inversion: number): number[] => {
  if (inversion === 0) return chord;
  const [first, ...rest] = chord;
  const last = first + 12;
  const newChord = [...rest, last];
  return getInverted(newChord, inversion - 1);
};

const getExtended = (note: number, extension: number): number[] => {
  const base = [note, note + 4, note + 7];
  switch (extension) {
    case 5:
      return base;
    case 7:
      return [...base, note + 11];
    case 9:
      return [...base, note + 11, note + 14];
    default:
      return base;
  }
};

export const getChord = ({
  note,
  extension,
  key,
  disabled,
}: Options): number[] => {
  if (disabled) return [note];
  const tonic = keyMap[key];
  const extended = getExtended(tonic, extension);
  const inversion = inversionMap[note] || 0;
  const inverted = getInverted(extended, inversion);
  return inverted;
};
