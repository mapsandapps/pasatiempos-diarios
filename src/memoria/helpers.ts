import { findIndex, reduce, sample, sampleSize, uniq } from "lodash";
import type {
  InProgressSlot,
  MemoriaInProgressPuzzle,
  MemoriaPuzzle,
  Slot,
} from "./types";

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

const getRandomOrderOfFirstSpanishWords = (slots: Slot[]) => {
  const uniqueFirstSpanishWords = uniq(
    slots.map((slot) => slot.emoji.spanishWords[0]),
  );
  const randomOrder = sampleSize(
    uniqueFirstSpanishWords,
    uniqueFirstSpanishWords.length,
  );

  return randomOrder;
};

export const constructInProgressPuzzle = (
  puzzle: MemoriaPuzzle,
): MemoriaInProgressPuzzle => {
  const inProgressPuzzle: MemoriaInProgressPuzzle = [];

  const firstSpanishWords = getRandomOrderOfFirstSpanishWords(puzzle.slots);

  puzzle.slots.forEach((slot, i) => {
    const inProgressSlot: InProgressSlot = {
      emoji: slot.emoji,
      isImage: slot.isImage,
      hasBeenMatched: false,
      numberOfFlips: 0,
      index: i,
      // compare words by their first spanish word and then give each pair a random index
      pairIndex: findIndex(
        firstSpanishWords,
        (word) => word === slot.emoji.spanishWords[0],
      ),
    };
    inProgressPuzzle.push(inProgressSlot);
  });

  return inProgressPuzzle;
};
