import { PuzzleDateSpecificity, type GenericPuzzle } from "../types";

export const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

export const getPuzzleForDate = (
  todayString: string,
  puzzles: GenericPuzzle[],
  specificity: PuzzleDateSpecificity
): GenericPuzzle => {
  if (specificity === PuzzleDateSpecificity.MatchDayOfMonth) {
    const todayDayOfMonth = Number(todayString.slice(-2));
    const todayPuzzle = puzzles.find((puzzle) => {
      const puzzleDayOfMonth = Number(puzzle.date.slice(-2));
      return puzzleDayOfMonth === todayDayOfMonth;
    });

    if (!todayPuzzle) {
      console.error("no puzzle found");
      return puzzles[0];
    }
    return todayPuzzle;
  } else if (specificity === PuzzleDateSpecificity.MatchDayOfYear) {
    const todayDayOfYear = Number(todayString.slice(-5));
    const todayPuzzle = puzzles.find((puzzle) => {
      const puzzleDayOfYear = Number(puzzle.date.slice(-5));
      return puzzleDayOfYear === todayDayOfYear;
    });

    if (!todayPuzzle) {
      console.error("no puzzle found");
      return puzzles[0];
    }
    return todayPuzzle;
  }

  // if specificity === PuzzleDateSpecificity.MatchDate
  const todayDay = Number(todayString);
  const todayPuzzle = puzzles.find((puzzle) => {
    const puzzleDay = Number(puzzle.date);
    return puzzleDay === todayDay;
  });

  if (!todayPuzzle) {
    console.error("no puzzle found");
    return puzzles[0];
  }
  return todayPuzzle;
};
