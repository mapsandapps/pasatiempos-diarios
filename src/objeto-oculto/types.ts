export interface IconData {
  filename: string;
  spanishWords: string[];
}

export interface Icon {
  x: number;
  y: number;
  rotation: number;
  filename: string;
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
  iconDir: string;
  totalIconsShown: number;
  hasArgentinianBias: boolean; // the first item in each spanishWords array is Argentinian, where relevant
}
