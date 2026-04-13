export interface GenericPuzzle {
  date: string;
}

export interface RawPuzzle extends GenericPuzzle {
  puzzle: string[];
}

export const GameString = {
  ObjetoOculto: "objeto-oculto",
  Silabas: "silabas",
  Memoria: "memoria",
  Ortografia: "ortografia",
} as const;

export type GameString = (typeof GameString)[keyof typeof GameString];
