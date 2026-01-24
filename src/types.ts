export interface GenericPuzzle {
  date: string;
}

export const PuzzleDateSpecificity = {
  MatchDate: 0,
  MatchDayOfYear: 1,
  MatchDayOfMonth: 2,
  // MatchDayOfWeek: 3,
} as const;

export const GameString = {
  ObjetoOculto: "objeto-oculto",
  Silabas: "silabas",
} as const;

export type PuzzleDateSpecificity =
  (typeof PuzzleDateSpecificity)[keyof typeof PuzzleDateSpecificity];

export type GameString = (typeof GameString)[keyof typeof GameString];
