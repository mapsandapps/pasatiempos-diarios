import { useEffect, useState } from "react";
import "./Game.scss";
import { cloneDeep, fill, isEqual, sampleSize } from "lodash";
import type { Definition, Puzzle } from "../types";
import { addDateToLocalStorage } from "../utils/localstorage";

interface GameProps {
  puzzle: string[];
  puzzleDate: string;
}

const getSolution = (puzzle: string[]): Definition[] => {
  const solution: Definition[] = [];

  puzzle.forEach((def) => {
    const [syllables, definition] = def.split("|");
    solution.push({
      definition,
      syllables: syllables.split("-"),
    });
  });

  return solution;
};

const initProgress = (solution: Definition[]): Puzzle => {
  const inProgressPuzzle: Puzzle = {
    words: [],
    syllables: [],
  };

  solution.forEach((def) => {
    const { definition, syllables } = def;
    inProgressPuzzle.words.push({
      definition,
      syllables: fill(Array(syllables.length), ""),
    });
    inProgressPuzzle.syllables.push(...syllables);
  });

  // randomize syllables
  inProgressPuzzle.syllables = sampleSize(
    inProgressPuzzle.syllables,
    inProgressPuzzle.syllables.length
  );

  return inProgressPuzzle;
};

const findFirstEmptySyllable = (
  activeWordIndex: number,
  inProgressPuzzle: Puzzle
) => {
  const activeWord = inProgressPuzzle.words[activeWordIndex];

  return activeWord.syllables.findIndex((syllable) => syllable === "");
};

export default function Game(props: GameProps) {
  const [hasWon, setHasWon] = useState(false);
  const [showWinScreen, setShowWinScreen] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [activeSyllableIndex, setActiveSyllableIndex] = useState(0);
  const solution = getSolution(props.puzzle);
  const [inProgressPuzzle, setInProgressPuzzle] = useState(
    initProgress(solution)
  );

  const win = () => {
    setHasWon(true);
    setShowWinScreen(true);
    addDateToLocalStorage("silabas", props.puzzleDate);
  };

  // check for win condition
  useEffect(() => {
    let hasLost = false;
    if (inProgressPuzzle.syllables.length < 1) {
      solution.forEach((word, wordIndex) => {
        word.syllables.forEach((syllable, syllableIndex) => {
          if (
            syllable !==
            inProgressPuzzle.words[wordIndex].syllables[syllableIndex]
          ) {
            hasLost = true;
            return;
          }
        });
      });

      if (!hasLost) {
        win();
      }
    }
  }, [inProgressPuzzle.syllables]);

  // if syllable index is provided, set to that; otherwise set to the first empty syllable in the word
  const setActiveSyllable = (
    activeWordIndex: number,
    puzzleState: Puzzle,
    syllableIndex?: number
  ) => {
    if (syllableIndex && syllableIndex >= 0) {
      setActiveSyllableIndex(syllableIndex);
    } else {
      setActiveSyllableIndex(
        findFirstEmptySyllable(activeWordIndex, puzzleState)
      );
    }
  };

  const setSyllable = (
    wordIndex: number,
    syllableIndex: number,
    bankIndex: number,
    syllable: string
  ) => {
    if (syllableIndex < 0) {
      console.warn("no active tile to place syllable");
      return;
    }

    const puzzle = cloneDeep(inProgressPuzzle);

    const activeWord = puzzle.words[wordIndex];
    if (activeWord.syllables[syllableIndex] !== "") {
      console.error("tried to set syllable where there already was one");
    } else {
      activeWord.syllables[syllableIndex] = syllable;
      puzzle.syllables.splice(bankIndex, 1);
      setInProgressPuzzle(puzzle);
      setActiveSyllable(wordIndex, puzzle);
    }
  };

  const unsetSyllable = (wordIndex: number, syllableIndex: number) => {
    const puzzle = cloneDeep(inProgressPuzzle);

    const activeWord = puzzle.words[wordIndex];
    const activeSyllable = activeWord.syllables[syllableIndex];

    if (!activeSyllable) {
      console.error("tried to unset empty syllable");
    }

    puzzle.syllables.push(activeSyllable);

    activeWord.syllables[syllableIndex] = "";
    setInProgressPuzzle(puzzle);
    // FIXME: this isn't working?
    setActiveSyllable(wordIndex, puzzle, syllableIndex);
  };

  const onClickWord = (i: number) => {
    if (hasWon) return;

    setActiveWordIndex(i);

    if (isWordCorrect(i)) return;
    setActiveSyllable(i, inProgressPuzzle);
    // useEffect will set the activeSyllableIndex
  };

  const onClickBank = (syllable: string, bankIndex: number) => {
    if (hasWon) return;

    if (activeSyllableIndex < 0) {
      console.warn("word was full");
      return;
    }

    setSyllable(activeWordIndex, activeSyllableIndex, bankIndex, syllable);
  };

  const onClickSyllable = (wordIndex: number, syllableIndex: number) => {
    if (hasWon) return;
    if (isWordCorrect(wordIndex)) return;

    setActiveWordIndex(wordIndex);
    setActiveSyllableIndex(syllableIndex);

    const activeWord = inProgressPuzzle.words[wordIndex];
    if (activeWord.syllables[syllableIndex] !== "") {
      // remove the syllable just clicked
      unsetSyllable(wordIndex, syllableIndex);
    }
  };

  const closeWinScreen = () => {
    setShowWinScreen(false);
  };

  const isWordCorrect = (i: number): boolean => {
    return isEqual(inProgressPuzzle.words[i]?.syllables, solution[i].syllables);
  };

  return (
    <div className={`game-container ${hasWon ? "game-over" : ""}`}>
      {/* {todayWeekday}, {today.toLocaleDateString()} */}
      {showWinScreen && (
        <div className="complete">
          <button onClick={closeWinScreen}>✖</button>
          <div>You won!</div>
        </div>
      )}
      <div className="game">
        {inProgressPuzzle.words.map((word, i) => (
          <div
            className={`word ${i === activeWordIndex ? "active" : ""} ${
              isWordCorrect(i) ? "correct" : ""
            }`}
            key={i}
            onClick={() => onClickWord(i)}
          >
            <div className="definition">{word.definition}</div>
            <div>
              {word.syllables.map((syllable, j) => (
                <div
                  className={`${syllable === "" ? "empty-syllable" : ""} ${
                    activeWordIndex === i && activeSyllableIndex === j
                      ? "active-syllable"
                      : ""
                  } syllable`}
                  onClick={() => onClickSyllable(i, j)}
                  key={j}
                >
                  {syllable}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="bank">
          {inProgressPuzzle.syllables.map((syllable, i) => (
            <div
              className="syllable"
              onClick={() => onClickBank(syllable, i)}
              key={i}
            >
              {syllable}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
