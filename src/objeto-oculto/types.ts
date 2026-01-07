export interface IconData {
  filename: string;
  spanishWords: string[];
}

export interface Icon {
  x: number;
  y: number;
  filename: string;
}

export interface IconToFind extends Icon {
  spanishWord: string;
  hasBeenFound: boolean;
}

export interface IconSet {
  icons: IconData[];
  name: string;
  iconDir: string;
  iconWidth: number;
  iconHeight: number;
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
