import { useEffect, useState } from "react";
import Game from "./Game";
import "./Silabas.scss";
import "../GamePage.scss";
import type { RawPuzzle } from "../types";
import { getPuzzleForDate, getTodayString } from "../utils/dates";
import { GameString } from "../types";
import { useSearchParams } from "react-router";
import PuzzleDate from "../components/PuzzleDate";
import Win from "../components/Win";

export default function Silabas() {
  const [puzzle, setPuzzle] = useState<RawPuzzle>();
  const todayString = getTodayString();
  const [searchParams] = useSearchParams();
  const [showWinScreen, setShowWinScreen] = useState(false);
  const queryParamDate = searchParams.get("date");
  const isDailyPuzzle =
    queryParamDate && queryParamDate !== todayString ? false : true;

  // onInit
  useEffect(() => {
    setPuzzle(
      getPuzzleForDate(
        GameString.Silabas,
        queryParamDate || todayString,
      ) as RawPuzzle,
    );
  }, []);

  const puzzleDate = isDailyPuzzle ? todayString : queryParamDate || undefined;

  const onWin = () => {
    setShowWinScreen(true);
  };

  const closeWinScreen = () => {
    setShowWinScreen(false);
  };

  return (
    <div id="silabas" className="game-page">
      <div className="about">
        <h1>Sílabas</h1>
        <div>
          Form Spanish words from their syllables and English definitions
        </div>
        <PuzzleDate
          puzzleDate={puzzleDate}
          isDailyPuzzle={isDailyPuzzle}
          puzzleLocalStorageString={GameString.Silabas}
        />
      </div>
      <div className="container">
        {showWinScreen && <Win closeWinScreen={closeWinScreen} canBeHidden />}
        {puzzle ? (
          <Game
            puzzle={puzzle.puzzle}
            todayString={todayString}
            isDailyPuzzle={isDailyPuzzle}
            onWin={onWin}
          />
        ) : (
          <div className="error">An error has occurred</div>
        )}
      </div>
    </div>
  );
}
