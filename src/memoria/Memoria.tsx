import { useSearchParams } from "react-router";
import PuzzleDate from "../components/PuzzleDate";
import "./Memoria.scss";
import { getPuzzleForDate, getTodayString } from "../utils/dates";
import { useEffect, useState } from "react";
import {
  addSettingToLocalStorage,
  getSettingFromLocalStorage,
} from "../utils/localstorage";
import { GameString } from "../types";
import type { MemoriaMinifiedPuzzle, MemoriaPuzzle } from "./types";
import MemoriaGame from "./MemoriaGame";
import { unminifyPuzzle } from "./helpers";

export default function Memoria() {
  const todayString = getTodayString();
  const [searchParams] = useSearchParams();
  const queryParamDate = searchParams.get("date");
  const [isDailyPuzzle] = useState(
    queryParamDate && queryParamDate !== todayString ? false : true,
  );
  const [puzzle, setPuzzle] = useState<MemoriaPuzzle>();
  const puzzleDate = isDailyPuzzle ? todayString : queryParamDate || undefined;

  const includesColors = puzzle?.name.toLowerCase().includes("color");
  // is the puzzle using colorblind mode? true if the user has the setting on and the puzzle involves colors
  const [isInColorblindMode, setColorblindMode] = useState(false);
  // does the user want colorblind mode on when relevant?
  const [prefersColorblindMode, setPrefersColorblindMode] = useState(
    getSettingFromLocalStorage("prefersColorblindMode") == "true",
  );

  // NOTE: this can currently only be changed via the secret settings page
  const [hasArgentinianBias] = useState(
    getSettingFromLocalStorage("hasArgentinianBias") == "true",
  );

  const handleColorblindOnChange = () => {
    setPrefersColorblindMode(!prefersColorblindMode);
  };

  // onInit
  useEffect(() => {
    const puzzle = getPuzzleForDate(
      GameString.Memoria,
      queryParamDate || todayString,
    ) as MemoriaMinifiedPuzzle;

    setPuzzle(unminifyPuzzle(puzzle));
  }, []);

  useEffect(() => {
    if (includesColors) {
      // if it's in localstorage, turn it on, otherwise, turn it off
      if (prefersColorblindMode) {
        setColorblindMode(true);
      } else {
        setColorblindMode(false);
      }
    } else {
      // not relevant if the puzzle doesn't involve colors
      setColorblindMode(false);
    }
  }, [includesColors, prefersColorblindMode]);

  // save colorblind preference to localstorage whenever it changes
  useEffect(() => {
    addSettingToLocalStorage("prefersColorblindMode", prefersColorblindMode);
  }, [prefersColorblindMode]);

  return (
    <div id="memoria">
      <div className="about">
        <h1>Memoria</h1>
        <div>Match images with their definitions in Spanish</div>
        <PuzzleDate
          puzzleDate={puzzleDate}
          isDailyPuzzle={isDailyPuzzle}
          puzzleLocalStorageString={GameString.Memoria}
        />
        {/* if the puzzle includes colors, add colorblindness mode option */}
        {includesColors && (
          <label className="colorblind-input">
            <input
              type="checkbox"
              name="colorblind-mode"
              checked={prefersColorblindMode}
              onChange={handleColorblindOnChange}
            />
            Colorblind Mode
          </label>
        )}
      </div>
      <div>
        {puzzle && (
          <MemoriaGame
            todayString={todayString}
            puzzle={puzzle}
            isDailyPuzzle={isDailyPuzzle}
            isInColorblindMode={isInColorblindMode}
            hasArgentinianBias={hasArgentinianBias}
          />
        )}
      </div>
    </div>
  );
}
