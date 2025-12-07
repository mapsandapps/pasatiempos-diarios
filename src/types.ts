export interface Definition {
  definition: string;
  syllables: string[];
}

export interface RawPuzzle {
  date: string;
  rangeStart: string;
  rangeEnd: string;
  puzzle: string[];
}

export interface Puzzle {
  words: Definition[];
  syllables: string[];
}
