export interface GenericPuzzle {
  date: string;
}

export const GameString = {
  ObjetoOculto: "objeto-oculto",
  Silabas: "silabas",
} as const;

export type GameString = (typeof GameString)[keyof typeof GameString];
