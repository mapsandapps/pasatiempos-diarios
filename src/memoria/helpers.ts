import { fill, reduce, sample, sampleSize, uniq } from "lodash";
import type {
  InProgressSlot,
  MemoriaPuzzle,
  MemoriaMinifiedPuzzle,
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

export const getRandomOrderOfFirstSpanishWords = (slots: Slot[]) => {
  const uniqueFirstSpanishWords = uniq(
    slots.map((slot) => slot.emoji.spanishWords[0]),
  );
  const randomOrder = sampleSize(
    uniqueFirstSpanishWords,
    uniqueFirstSpanishWords.length,
  );

  return randomOrder;
};

export const unminifyPuzzle = (
  minifiedPuzzle: MemoriaMinifiedPuzzle,
): MemoriaPuzzle => {
  const puzzle = {
    date: minifiedPuzzle.date,
    name: minifiedPuzzle.name,
    iconDir: minifiedPuzzle.iconDir,
    // @ts-ignore
    slots: fill(
      Array(minifiedPuzzle.pairs.length * 2),
      undefined,
    ) as InProgressSlot[],
  };

  minifiedPuzzle.pairs.forEach((pair, i) => {
    puzzle.slots[pair.imageIndex] = {
      emoji: pair.emoji,
      isImage: true,
      pairIndex: i,
      index: pair.imageIndex,
      hasBeenMatched: false,
      numberOfFlips: 0,
    };
    puzzle.slots[pair.textIndex] = {
      emoji: pair.emoji,
      isImage: false,
      pairIndex: i,
      index: pair.textIndex,
      hasBeenMatched: false,
      numberOfFlips: 0,
    };
  });

  return puzzle;
};

export const minifyPuzzle = (puzzle: MemoriaPuzzle): MemoriaMinifiedPuzzle => {
  const minifiedPuzzle: MemoriaMinifiedPuzzle = {
    date: puzzle.date,
    name: puzzle.name,
    iconDir: puzzle.iconDir,
    pairs: [],
  };

  const firstSpanishWords = getRandomOrderOfFirstSpanishWords(puzzle.slots);

  firstSpanishWords.forEach((word) => {
    const pair = puzzle.slots.filter((slot) => {
      return slot.emoji.spanishWords[0] === word;
    });

    if (pair.length !== 2) {
      console.error("pair isn't a pair");
      return;
    }

    minifiedPuzzle.pairs.push({
      emoji: pair[0].emoji,
      textIndex: puzzle.slots.findIndex(
        (slot) => slot.emoji.spanishWords[0] === word && !slot.isImage,
      ),
      imageIndex: puzzle.slots.findIndex(
        (slot) => slot.emoji.spanishWords[0] === word && slot.isImage,
      ),
    });
  });

  return minifiedPuzzle;
};
