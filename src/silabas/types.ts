import type { GenericPuzzle } from "../types";

export interface Definition {
  definition: string;
  syllables: string[];
}

export interface RawPuzzle extends GenericPuzzle {
  rangeStart?: string;
  rangeEnd?: string;
  puzzle: string[];
}

export interface Puzzle {
  words: Definition[];
  syllables: string[];
}
