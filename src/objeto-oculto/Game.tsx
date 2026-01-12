import { useEffect, useMemo, useRef, useState } from "react";
import "./Game.scss";
import { addDateToLocalStorage } from "../utils/localstorage";
import type { Icon, IconToFind, Puzzle } from "./types";
import { cloneDeep, find, findLast } from "lodash";
import Win from "../components/Win";

const ICON_SIZE = 48;

interface GameProps {
  todayString: string;
  puzzle: Puzzle;
}

const isClickInIcon = (icon: Icon, clickX: number, clickY: number) => {
  const isXInIcon = clickX >= icon.x && clickX <= icon.x + ICON_SIZE;
  const isYInIcon = clickY >= icon.y && clickY <= icon.y + ICON_SIZE;

  return isXInIcon && isYInIcon;
};

export default function Game(props: GameProps) {
  const [hasWon, setHasWon] = useState(false);
  const [showWinScreen, setShowWinScreen] = useState(false);
  const [wrongIconClicked, setWrongIconClicked] = useState<Icon>();
  const [inProgressPuzzle, setInProgressPuzzle] = useState(props.puzzle);
  const clickAreaRef = useRef<HTMLDivElement>(null);

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
    setWrongIconClicked(undefined);

    if (hasWon) return;

    if (!currentIcon) console.error("icon not found in puzzle");

    if (clickAreaRef.current) {
      const rect = clickAreaRef.current?.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      if (isClickInIcon(currentIcon!, clickX, clickY)) {
        markCurrentIconFound();
      } else {
        // look thru `otherIcons` first, then `iconsToFind`. this order will insure the last match found is the correct (highest "z-index") one
        inProgressPuzzle.otherIcons.forEach((icon) => {
          if (isClickInIcon(icon, clickX, clickY)) {
            setWrongIconClicked(icon);
          }
        });
        inProgressPuzzle.iconsToFind.forEach((icon) => {
          if (isClickInIcon(icon, clickX, clickY)) {
            setWrongIconClicked(icon);
          }
        });
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
    // onInit
    setInProgressPuzzle(props.puzzle);
    setHasWon(false);
    setShowWinScreen(false);
  }, [props.puzzle]);

  // check for win condition
  useEffect(() => {
    if (!find(inProgressPuzzle.iconsToFind, ["hasBeenFound", false])) {
      win();
    }
  }, [inProgressPuzzle]);

  return (
    <div className={`objeto-oculto-game ${hasWon ? "game-over" : ""}`}>
      {showWinScreen && <Win canBeHidden={false} />}
      <div id="game">
        {inProgressPuzzle.otherIcons.map((icon) => {
          return (
            <img
              key={`${icon.filename}`}
              src={`${inProgressPuzzle.iconDir}/${icon.filename}`}
              className="game-icon"
              width={`${ICON_SIZE}px`}
              height={`${ICON_SIZE}px`}
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
              width={`${ICON_SIZE}px`}
              height={`${ICON_SIZE}px`}
              data-spanishword={icon.spanishWord}
              style={{
                left: `${icon.x}px`,
                top: `${icon.y}px`,
                transform: `rotate(${icon.rotation}deg)`,
              }}
            ></img>
          );
        })}
        {wrongIconClicked && (
          <div
            className="wrong-icon-name"
            style={{
              left: `${wrongIconClicked.x}px`,
              top: `${wrongIconClicked.y}px`,
              opacity: 1,
            }}
            onAnimationEnd={() => setWrongIconClicked(undefined)}
          >
            {wrongIconClicked.spanishWord}
          </div>
        )}
        <div id="click-area" ref={clickAreaRef} onClick={onClickArea}></div>
        {currentIcon && (
          <div id="current-target">Find: {currentIcon!.spanishWord}</div>
        )}
      </div>
    </div>
  );
}
