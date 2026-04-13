export interface Word {
  spanishWord: string;
  definition: string;
  isCorrect: boolean;
}

export type OrtografiaPuzzle = Word[];

export type OrtografiaGameMode = "LOADING" | "SPELLING" | "MATCHING";

export interface OrtographiaPair {
  spanish: string;
  english: string;
}
