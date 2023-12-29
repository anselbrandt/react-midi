interface Options {
  note: number;
}

export const getChord = ({ note }: Options) => {
  return [note];
};
