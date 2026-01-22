import { capitalizeFirstLetter } from "../utils/helpers";
import { fill, sampleSize } from "lodash";
import type { Definition, Puzzle } from "./types";

export const minifyWord = (english: string, syllables: string[]): string => {
  return `${syllables.join("-")}|${capitalizeFirstLetter(english)}`;
};

export const getSolution = (puzzle: string[]): Definition[] => {
  const solution: Definition[] = [];

  puzzle.forEach((def) => {
    const [syllables, definition] = def.split("|");
    solution.push({
      definition,
      syllables: syllables.split("-"),
    });
  });

  return solution;
};

export const initProgress = (solution: Definition[]): Puzzle => {
  const inProgressPuzzle: Puzzle = {
    words: [],
    syllables: [],
  };

  solution.forEach((def) => {
    const { definition, syllables } = def;
    inProgressPuzzle.words.push({
      definition,
      syllables: fill(Array(syllables.length), ""),
    });
    inProgressPuzzle.syllables.push(...syllables);
  });

  // randomize syllables
  inProgressPuzzle.syllables = sampleSize(
    inProgressPuzzle.syllables,
    inProgressPuzzle.syllables.length
  );

  return inProgressPuzzle;
};

export const findFirstEmptySyllable = (
  activeWordIndex: number,
  inProgressPuzzle: Puzzle
) => {
  const activeWord = inProgressPuzzle.words[activeWordIndex];

  return activeWord.syllables.findIndex((syllable) => syllable === "");
};
