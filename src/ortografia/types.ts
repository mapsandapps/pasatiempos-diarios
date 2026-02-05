import type { GenericPuzzle } from "../types";

export interface Word {
  spanishWord: string;
  definition: string;
}

export interface OrtografiaPuzzle extends GenericPuzzle {
  words: Word[];
}
