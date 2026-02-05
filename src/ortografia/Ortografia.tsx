import { useSearchParams } from "react-router";
import PuzzleDate from "../components/PuzzleDate";
import "./Ortografia.scss";
import { getPuzzleForDate, getTodayString } from "../utils/dates";
import { useEffect, useState } from "react";
import { GameString } from "../types";
import OrtografiaGame from "./OrtografiaGame";
import type { RawPuzzle } from "../types";
import { unminifyPuzzle } from "./helpers";
import type { OrtografiaPuzzle } from "./types";

export default function Ortografia() {
  const todayString = getTodayString();
  const [searchParams] = useSearchParams();
  const queryParamDate = searchParams.get("date");
  const [isDailyPuzzle] = useState(
    queryParamDate && queryParamDate !== todayString ? false : true,
  );
  const [puzzle, setPuzzle] = useState<OrtografiaPuzzle>();
  const puzzleDate = isDailyPuzzle ? todayString : queryParamDate || undefined;

  // onInit
  useEffect(() => {
    const puzzle = getPuzzleForDate(
      GameString.Ortografia,
      queryParamDate || todayString,
    ) as RawPuzzle;

    setPuzzle(unminifyPuzzle(puzzle));
  }, []);

  return (
    <div id="ortografia">
      <div className="about">
        <h1>Ortografía</h1>
        <PuzzleDate
          puzzleDate={puzzleDate}
          isDailyPuzzle={isDailyPuzzle}
          puzzleLocalStorageString={GameString.Ortografia}
        />
      </div>
      <div>
        {puzzle && (
          <OrtografiaGame
            todayString={todayString}
            puzzle={puzzle}
            isDailyPuzzle={isDailyPuzzle}
          />
        )}
      </div>
    </div>
  );
}
