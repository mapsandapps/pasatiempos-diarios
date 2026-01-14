export interface IconData {
  filename: string;
  spanishWords: string[];
}

export interface Icon {
  x: number;
  y: number;
  rotation: number;
  filePath: string;
  spanishWord: string;
}

export interface IconToFind extends Icon {
  hasBeenFound: boolean;
}

export interface IconSet {
  icons: IconData[];
  name: string;
  iconDir: string;
  source?: string;
}

export interface Puzzle {
  iconsToFind: IconToFind[];
  otherIcons: Icon[];
  name: string;
  totalIconsShown: number;
  hasArgentinianBias: boolean; // the first item in each spanishWords array is Argentinian, where relevant
}

export type MinimizedIcon = [
  filePath: string,
  spanishWord: string,
  x: number,
  y: number,
  rotation: number
  // NOTE: these don't have `hasBeenFound` because this is just a format for storing puzzles, not for using while the puzzle is being completed
  // if i end up using this for e.g. storing state of in-progress puzzles, this will need to change
];

export interface MinimizedPuzzle {
  iconsToFind: MinimizedIcon[];
  otherIcons: MinimizedIcon[];
  name: string;
  totalIconsShown: number;
  hasArgentinianBias: boolean;
}
