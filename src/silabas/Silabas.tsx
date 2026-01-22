import { useEffect, useState } from "react";
import Game from "./Game";
import { puzzles } from "./puzzles";
import "./Silabas.scss";
import type { RawPuzzle } from "./types";
import { getPuzzleForDate, getTodayString } from "../utils/dates";
import { isTodayInLocalStorage } from "../utils/localstorage";
import { PuzzleDateSpecificity } from "../types";

export default function Silabas() {
  const [puzzle, setPuzzle] = useState<RawPuzzle>();
  const todayString = getTodayString();

  const date = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // onInit
  useEffect(() => {
    setPuzzle(
      getPuzzleForDate(
        todayString,
        puzzles,
        PuzzleDateSpecificity.MatchDayOfMonth
      ) as RawPuzzle
    );
  }, []);

  return (
    <div id="silabas">
      <div className="about">
        <h1>Sílabas</h1>
        <div>
          Form Spanish words from their syllables and English definitions
        </div>
        <div className="date">
          {date}
          {isTodayInLocalStorage("silabas") && " ✅"}
        </div>
      </div>
      <div>
        {puzzle ? (
          <Game
            puzzle={puzzle.puzzle}
            todayString={todayString}
            isDailyPuzzle
          />
        ) : (
          <div className="error">An error has occurred</div>
        )}
      </div>
    </div>
  );
}
