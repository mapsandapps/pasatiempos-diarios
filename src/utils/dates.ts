import {
  PuzzleDateSpecificity,
  GameString,
  type GenericPuzzle,
} from "../types";
import {
  puzzles as objetoOcultoPuzzles,
  PUZZLE_DATE_SPECIFICITY as objetoOcultoDateSpecificity,
} from "../objeto-oculto/puzzles";
import {
  puzzles as silabasPuzzles,
  PUZZLE_DATE_SPECIFICITY as silabasDateSpecificity,
} from "../silabas/puzzles";
import { format } from "date-fns";

const games = {
  "objeto-oculto": {
    puzzles: objetoOcultoPuzzles,
    puzzleDateSpecificity: objetoOcultoDateSpecificity,
  },
  silabas: {
    puzzles: silabasPuzzles,
    puzzleDateSpecificity: silabasDateSpecificity,
  },
};

export const getTodayString = () => {
  return format(new Date(), "yyyy-MM-dd");
};

export const getPuzzleForDate = (
  gameString: GameString,
  isDailyPuzzle: boolean,
  dateString: string
): GenericPuzzle => {
  const gameData = games[gameString];
  const specificity = isDailyPuzzle
    ? gameData.puzzleDateSpecificity
    : PuzzleDateSpecificity.MatchDate;

  if (!gameData || !gameData.puzzles)
    console.error("no data found for this game");

  if (specificity === PuzzleDateSpecificity.MatchDayOfMonth) {
    const todayDayOfMonth = Number(dateString.slice(-2));
    const todayPuzzle = gameData.puzzles.find((puzzle) => {
      const puzzleDayOfMonth = Number(puzzle.date.slice(-2));
      return puzzleDayOfMonth === todayDayOfMonth;
    });

    if (!todayPuzzle) {
      console.error("no puzzle found");
      return gameData.puzzles[0];
    }
    return todayPuzzle;
  } else if (specificity === PuzzleDateSpecificity.MatchDayOfYear) {
    const todayDayOfYear = dateString.slice(-5);
    const todayPuzzle = gameData.puzzles.find((puzzle) => {
      const puzzleDayOfYear = puzzle.date.slice(-5);
      return puzzleDayOfYear === todayDayOfYear;
    });

    if (!todayPuzzle) {
      console.error("no puzzle found");
      return gameData.puzzles[0];
    }
    return todayPuzzle;
  }

  // if specificity === PuzzleDateSpecificity.MatchDate
  const todayPuzzle = gameData.puzzles.find((puzzle) => {
    return puzzle.date === dateString;
  });

  if (!todayPuzzle) {
    console.error("no puzzle found");
    return gameData.puzzles[0];
  }
  return todayPuzzle;
};
