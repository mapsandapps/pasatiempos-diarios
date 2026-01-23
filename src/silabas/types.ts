import type { GenericPuzzle } from "../types";

export interface RawPuzzle extends GenericPuzzle {
  puzzle: string[];
}

export interface Syllable {
  text: string;
  isInUse: boolean;
}

export interface Definition {
  definition: string;
  syllables: string[];
}

/** the in-progress puzzle & its state */
export interface Puzzle {
  words: Definition[];
  syllables: Syllable[];
}
