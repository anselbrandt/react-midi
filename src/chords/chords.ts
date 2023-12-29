interface Options {
  note: number;
  extension: number;
  key: string;
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

export const getChord = ({ note, extension, key }: Options): number[] => {
  console.log(note - 48, extension, key);
  const root = rootMap[key];
  return [root, root + 4, root + 7];
};
