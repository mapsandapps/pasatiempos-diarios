import { useEffect, useState } from "react";
import { isDateInLocalStorage } from "../utils/localstorage";
import Game from "./Game";
import { puzzles } from "./puzzles";
import "./Silabas.scss";

export default function Silabas() {
  const [hasBeenSolved, setHasBeenSolved] = useState(false);

  const date = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const today = new Date();
  const todayWeekday = today.getDay();
  const todayPuzzle = puzzles.find((puzzle) => {
    // NOTE: this can be off a day from what you'd expect, but this is temporary code anyway
    const puzzleWeekday = new Date(puzzle.date).getDay();
    return puzzleWeekday === todayWeekday;
  });

  // onInit
  useEffect(() => {
    if (todayPuzzle) {
      setHasBeenSolved(isDateInLocalStorage("silabas", todayPuzzle.date));
    }
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
        {todayPuzzle ? (
          <Game puzzle={todayPuzzle.puzzle} puzzleDate={todayPuzzle.date} />
        ) : (
          <div className="error">An error has occurred</div>
        )}
      </div>
    </div>
  );
}
