export const getChord = (note: number, harmonize: boolean) => {
  if (!harmonize) return [note];
  return [note, note + 4, note + 7];
};
