import { GameString, type GenericPuzzle } from "../types";
import { puzzles as objetoOcultoPuzzles } from "../objeto-oculto/puzzles";
import { puzzles as silabasPuzzles } from "../silabas/puzzles";
import { format } from "date-fns";

const games = {
  "objeto-oculto": {
    name: GameString.ObjetoOculto,
    puzzles: objetoOcultoPuzzles,
  },
  silabas: {
    name: GameString.Silabas,
    puzzles: silabasPuzzles,
  },
};

export const getTodayString = () => {
  return format(new Date(), "yyyy-MM-dd");
};

const findPuzzleForExactDate = (
  puzzles: GenericPuzzle[],
  dateString: string
): GenericPuzzle | undefined => {
  const todayPuzzle = puzzles.find((puzzle) => {
    return puzzle.date === dateString;
  });

  if (!todayPuzzle) {
    console.warn("no puzzle found that matches exact date");
  }
  return todayPuzzle;
};

const findPuzzleForDayOfYear = (
  puzzles: GenericPuzzle[],
  dateString: string
): GenericPuzzle | undefined => {
  const todayDayOfYear = dateString.slice(-5);
  const todayPuzzle = puzzles.find((puzzle) => {
    const puzzleDayOfYear = puzzle.date.slice(-5);
    return puzzleDayOfYear === todayDayOfYear;
  });

  if (!todayPuzzle) {
    console.warn("no puzzle found that matches day of year");
  }
  return todayPuzzle;
};

const findPuzzleForDayOfMonth = (
  puzzles: GenericPuzzle[],
  dateString: string
): GenericPuzzle | undefined => {
  const todayDayOfMonth = Number(dateString.slice(-2));
  const todayPuzzle = puzzles.find((puzzle) => {
    const puzzleDayOfMonth = Number(puzzle.date.slice(-2));
    return puzzleDayOfMonth === todayDayOfMonth;
  });

  if (!todayPuzzle) {
    console.warn("no puzzle found that matches day of month");
  }
  return todayPuzzle;
};

export const getPuzzleForDate = (
  gameString: GameString,
  dateString: string
): GenericPuzzle => {
  const gameData = games[gameString];

  if (!gameData || !gameData.puzzles)
    console.error("no data found for this game");

  // look for puzzle matching this date
  const puzzleForExactDate = findPuzzleForExactDate(
    gameData.puzzles,
    dateString
  );

  if (puzzleForExactDate) {
    return puzzleForExactDate;
  }

  // if a puzzle matching this date wasn't found,
  // look for one matching this day of the year
  const puzzleForDayOfYear = findPuzzleForDayOfYear(
    gameData.puzzles,
    dateString
  );

  if (puzzleForDayOfYear) {
    return puzzleForDayOfYear;
  }

  // if a puzzle matching this date wasn't found,
  // look for one matching this day of the year
  const puzzleForDayOfMonth = findPuzzleForDayOfMonth(
    gameData.puzzles,
    dateString
  );

  if (puzzleForDayOfMonth) {
    return puzzleForDayOfMonth;
  }

  // if no puzzle at all, return gameData.puzzles[0] and error
  console.error("no puzzle found; defaulting to first puzzle");
  return gameData.puzzles[0];
};
