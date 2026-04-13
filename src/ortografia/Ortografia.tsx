import { useSearchParams } from "react-router";
import PuzzleDate from "../components/PuzzleDate";
import "./Ortografia.scss";
import "../GamePage.scss";
import { getPuzzleForDate, getTodayString } from "../utils/dates";
import { useEffect, useState } from "react";
import { GameString } from "../types";
import OrtografiaSpellingGame from "./OrtografiaSpellingGame";
import OrtografiaMatchingGame from "./OrtografiaMatchingGame";
import Win from "../components/Win";
import type { RawPuzzle } from "../types";
import { unminifyPuzzle } from "./helpers";
import type { OrtografiaGameMode, OrtografiaPuzzle } from "./types";

export default function Ortografia() {
  const todayString = getTodayString();
  const [searchParams] = useSearchParams();
  const queryParamDate = searchParams.get("date");
  const [isDailyPuzzle] = useState(
    queryParamDate && queryParamDate !== todayString ? false : true,
  );
  const [puzzle, setPuzzle] = useState<OrtografiaPuzzle>();
  const [showWinScreen, setShowWinScreen] = useState(false);
  const puzzleDate = isDailyPuzzle ? todayString : queryParamDate || undefined;
  const [gameMode, setGameMode] = useState<OrtografiaGameMode>("LOADING");

  // onInit
  useEffect(() => {
    const puzzle = getPuzzleForDate(
      GameString.Ortografia,
      queryParamDate || todayString,
    ) as RawPuzzle;

    setShowWinScreen(false);
    setPuzzle(unminifyPuzzle(puzzle));
    setGameMode("SPELLING");
  }, []);

  const onCompleteSpellingStage = () => {
    setGameMode("MATCHING");
  };

  const closeWinScreen = () => {
    setShowWinScreen(false);
  };

  const onWin = () => {
    setShowWinScreen(true);
  };

  return (
    <div id="ortografia" className="game-page">
      <div className="about">
        <h1>Ortografía</h1>
        <div>Learn the Spanish alphabet by spelling words you hear!</div>
        <PuzzleDate
          puzzleDate={puzzleDate}
          isDailyPuzzle={isDailyPuzzle}
          puzzleLocalStorageString={GameString.Ortografia}
        />
      </div>
      <div className="container">
        {showWinScreen && <Win closeWinScreen={closeWinScreen} canBeHidden />}
        {gameMode === "SPELLING" && puzzle && (
          <OrtografiaSpellingGame
            puzzle={puzzle}
            onCompleteSpellingStage={onCompleteSpellingStage}
          />
        )}
        {gameMode === "MATCHING" && puzzle && (
          <OrtografiaMatchingGame
            todayString={todayString}
            puzzle={puzzle}
            isDailyPuzzle={isDailyPuzzle}
            onWin={onWin}
          />
        )}
      </div>
    </div>
  );
}
