interface Options {
  note: number;
  extension: number;
  key: string;
  disabled: boolean;
}

const rootMap: Record<string, number> = {
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

export const getChord = ({
  note,
  extension,
  key,
  disabled,
}: Options): number[] => {
  if (disabled) return [note];
  const root = rootMap[key];
  if (extension === 7) return [root, root + 4, root + 7, root + 11];
  if (extension === 9) return [root, root + 4, root + 7, root + 14];
  return [root, root + 4, root + 7];
};
