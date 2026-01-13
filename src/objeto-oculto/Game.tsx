import { useEffect, useMemo, useRef, useState } from "react";
import "./Game.scss";
import { addDateToLocalStorage } from "../utils/localstorage";
import type { Icon, IconToFind, Puzzle } from "./types";
import { cloneDeep, filter, find, findLast } from "lodash";
import Win from "../components/Win";

const ICON_SIZE = 48;
const HINT_WAIT_TIME = 15; // seconds

interface GameProps {
  todayString: string;
  puzzle: Puzzle;
}

const numberRemaining = (iconsToFind: IconToFind[]) => {
  return filter(iconsToFind, ["hasBeenFound", false]).length;
};

const isClickInIcon = (icon: Icon, clickX: number, clickY: number) => {
  const isXInIcon = clickX >= icon.x && clickX <= icon.x + ICON_SIZE;
  const isYInIcon = clickY >= icon.y && clickY <= icon.y + ICON_SIZE;

  return isXInIcon && isYInIcon;
};

export default function Game(props: GameProps) {
  const [hasWon, setHasWon] = useState(false);
  const [showWinScreen, setShowWinScreen] = useState(false);
  const [time, setTime] = useState(0);
  const [wrongIconClicked, setWrongIconClicked] = useState<Icon>();
  const [inProgressPuzzle, setInProgressPuzzle] = useState(props.puzzle);
  const clickAreaRef = useRef<HTMLDivElement>(null);
  const stopwatchRef = useRef<any>(null);

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
        setTime(0);
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

    setTime(0);
    stopwatchRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    // clean up
    return () => {
      clearInterval(stopwatchRef.current);
    };
  }, [props.puzzle]);

  // check for win condition
  useEffect(() => {
    if (numberRemaining(inProgressPuzzle.iconsToFind) < 1) {
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
        {currentIcon && (
          <div className="current-target">
            Find: {currentIcon!.spanishWord}{" "}
            {time > HINT_WAIT_TIME && (
              <span>
                {" "}
                (
                <img
                  src={`${inProgressPuzzle.iconDir}/${currentIcon.filename}`}
                />
                )
              </span>
            )}
          </div>
        )}
        {numberRemaining(inProgressPuzzle.iconsToFind) <= 5 && (
          <div className="found-counter">
            {`${numberRemaining(inProgressPuzzle.iconsToFind)} remaining`}
          </div>
        )}
        <div id="click-area" ref={clickAreaRef} onClick={onClickArea}></div>
      </div>
    </div>
  );
}
