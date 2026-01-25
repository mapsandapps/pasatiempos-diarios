import { reduce, sample } from "lodash";

export const findIndexOfRandomEmptySlot = (slots: any[]): number => {
  const emptyIndices: number[] = reduce(
    slots,
    (result: number[], obj, i) => {
      if (!obj) {
        result.push(i);
      }
      return result;
    },
    [],
  );

  if (emptyIndices.length < 1) {
    console.error("no empty slot");
    return 0;
  }

  return sample(emptyIndices)!;
};
