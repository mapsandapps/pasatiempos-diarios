export interface Word {
  spanishWord: string;
  definition: string;
  isCorrect: boolean;
}

export type OrtografiaPuzzle = Word[];

export type OrtografiaGameMode = "LOADING" | "SPELLING" | "MATCHING";

export type OrtographiaCardColor =
  | "purple"
  | "yellow"
  | "blue"
  | "orange"
  | "green";

export interface OrtographiaPair {
  spanish: string;
  english: string;
  color: OrtographiaCardColor;
}
