interface Options {
  note: number;
  disabled: boolean;
}

export const getChord = ({ note, disabled }: Options) => {
  if (disabled) return [note];
  return [note, note + 4, note + 7];
};
