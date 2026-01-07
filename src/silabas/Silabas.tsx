import { useEffect, useState } from "react";
import Game from "./Game";
import { puzzles } from "./puzzles";
import "./Silabas.scss";
import type { RawPuzzle } from "./types";
import { getTodayString } from "../utils/dates";
import { isTodayInLocalStorage } from "../utils/localstorage";

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
    const todayDayOfMonth = Number(todayString.slice(-2));
    const todayPuzzle = puzzles.find((puzzle) => {
      const puzzleDayOfMonth = Number(puzzle.date.slice(-2));
      return puzzleDayOfMonth === todayDayOfMonth;
    });

    if (!todayPuzzle) {
      console.error("no puzzle found");
    }

    setPuzzle(todayPuzzle);
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
          <Game puzzle={puzzle.puzzle} todayString={todayString} />
        ) : (
          <div className="error">An error has occurred</div>
        )}
      </div>
    </div>
  );
}
