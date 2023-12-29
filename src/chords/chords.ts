interface Options {
  note: number;
}

export const getChord = ({ note }: Options): number[] => {
  return [note];
};
