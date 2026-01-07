import { useEffect, useMemo, useRef, useState } from "react";
import "./Game.scss";
import { addDateToLocalStorage } from "../utils/localstorage";
import type { IconToFind, Puzzle } from "./types";
import { cloneDeep, find, findLast } from "lodash";
import { Link } from "react-router";

interface GameProps {
  todayString: string;
  puzzle: Puzzle;
}

export default function Game(props: GameProps) {
  const [hasWon, setHasWon] = useState(false);
  const [showWinScreen, setShowWinScreen] = useState(false);
  const [inProgressPuzzle, setInProgressPuzzle] = useState(props.puzzle);
  const clickAreaRef = useRef<HTMLDivElement>(null);
  const iconSize = 48;

  // always will be the first `iconsToFind` that hasn't yet been found
  const currentIcon = useMemo(
    () => findLast(inProgressPuzzle.iconsToFind, ["hasBeenFound", false]),
    [inProgressPuzzle]
  );

  const markCurrentIconFound = () => {
    const puzzle = cloneDeep(inProgressPuzzle);

    const currentItem: IconToFind | undefined = find(puzzle.iconsToFind, [
      "spanishWord",
      currentIcon!.spanishWord,
    ]);

    if (!currentItem) console.error("icon not found in puzzle");

    currentItem!.hasBeenFound = true;

    setInProgressPuzzle(puzzle);
  };

  const onClickArea = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentIcon) console.error("icon not found in puzzle");

    if (clickAreaRef.current) {
      const rect = clickAreaRef.current?.getBoundingClientRect();
      const xClicked = e.clientX - rect.left;
      const yClicked = e.clientY - rect.top;

      const isXInIcon =
        xClicked >= currentIcon!.x && xClicked <= currentIcon!.x + iconSize;
      const isYInIcon =
        yClicked >= currentIcon!.y && yClicked <= currentIcon!.y + iconSize;

      if (isXInIcon && isYInIcon) {
        markCurrentIconFound();
      }
    }
  };

  const win = () => {
    console.log("won!");
    setHasWon(true);
    setShowWinScreen(true);
    addDateToLocalStorage("objeto-oculto", props.todayString);
  };

  useEffect(() => {
    console.log(inProgressPuzzle);
  }, [inProgressPuzzle]);

  useEffect(() => {
    // onInit
    console.log(props.puzzle);
  }, []);

  // check for win condition
  useEffect(() => {
    if (!find(inProgressPuzzle.iconsToFind, ["hasBeenFound", false])) {
      win();
    }
  }, [inProgressPuzzle]);

  return (
    <div className={`objeto-oculto-game ${hasWon ? "game-over" : ""}`}>
      {showWinScreen ? (
        <div className="complete">
          <div className="complete-header">You won!</div>
          <Link to="/">
            <button>Return to Menu</button>
          </Link>
        </div>
      ) : (
        <div id="game">
          {inProgressPuzzle.otherIcons.map((icon) => {
            return (
              <img
                key={`${icon.filename}`}
                src={`${inProgressPuzzle.iconDir}/${icon.filename}`}
                className="game-icon"
                width={`${iconSize}px`}
                height={`${iconSize}px`}
                style={{
                  left: `${icon.x}px`,
                  top: `${icon.y}px`,
                  transform: `rotate(${icon.rotation}deg)`,
                }}
              ></img>
            );
          })}
          {inProgressPuzzle.iconsToFind.map((icon) => {
            if (icon.hasBeenFound) return;

            return (
              <img
                key={`${icon.filename}`}
                src={`${inProgressPuzzle.iconDir}/${icon.filename}`}
                className="game-icon"
                width={`${iconSize}px`}
                height={`${iconSize}px`}
                data-spanishword={icon.spanishWord}
                style={{
                  left: `${icon.x}px`,
                  top: `${icon.y}px`,
                }}
              ></img>
            );
          })}
          <div id="click-area" ref={clickAreaRef} onClick={onClickArea}></div>
          {currentIcon && (
            <div id="current-target">Find: {currentIcon!.spanishWord}</div>
          )}
        </div>
      )}
    </div>
  );
}
