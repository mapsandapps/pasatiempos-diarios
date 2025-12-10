import { useEffect, useState } from "react";
import { isDateInLocalStorage } from "../utils/localstorage";
import Game from "./Game";
import { puzzles } from "./puzzles";
import "./Silabas.scss";
import type { RawPuzzle } from "../types";

export default function Silabas() {
  const [hasBeenSolved, setHasBeenSolved] = useState(false);
  const [puzzle, setPuzzle] = useState<RawPuzzle>();

  const date = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // onInit
  useEffect(() => {
    const today = new Date();
    const todayDayOfMonth = today.getDate();
    const todayPuzzle = puzzles.find((puzzle) => {
      const puzzleDayOfMonth = Number(puzzle.date.slice(-2));
      return puzzleDayOfMonth === todayDayOfMonth;
    });

    if (todayPuzzle) {
      setHasBeenSolved(isDateInLocalStorage("silabas", todayPuzzle.date));
    } else {
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
          {hasBeenSolved && " ✅"}
        </div>
      </div>
      <div>
        {puzzle ? (
          <Game puzzle={puzzle.puzzle} puzzleDate={puzzle.date} />
        ) : (
          <div className="error">An error has occurred</div>
        )}
      </div>
    </div>
  );
}
