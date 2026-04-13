import type { RawPuzzle } from "../types";
import type { OrtografiaPuzzle, Word } from "./types";

export const unminifyPuzzle = (puzzle: RawPuzzle): OrtografiaPuzzle => {
  const { puzzle: rawWords } = puzzle;

  const words: Word[] = [];

  rawWords.forEach((rawWord) => {
    const [spanishWord, definition] = rawWord.split("|");

    words.push({
      spanishWord,
      definition,
      isCorrect: false,
    });
  });

  return words;
};
