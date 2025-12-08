import { useEffect, useState } from "react";
import "./Game.scss";
import { cloneDeep, fill, last, sampleSize } from "lodash";
import type { Definition, Puzzle } from "../types";

interface GameProps {
  puzzle: string[];
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
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [activeSyllableIndex, setActiveSyllableIndex] = useState(0);
  const solution = getSolution(props.puzzle);
  const [inProgressPuzzle, setInProgressPuzzle] = useState(
    initProgress(solution)
  );

  // // on first render:
  // useEffect(() => {
  //   setInProgressPuzzle()
  // }, [])

  useEffect(() => {
    setActiveSyllableIndex(
      findFirstEmptySyllable(activeWordIndex, inProgressPuzzle)
    );
  }, [activeWordIndex, inProgressPuzzle.words[activeWordIndex]]);

  const setSyllable = (
    wordIndex: number,
    syllableIndex: number,
    bankIndex: number,
    syllable: string
  ) => {
    const puzzle = cloneDeep(inProgressPuzzle);

    const activeWord = puzzle.words[wordIndex];
    activeWord.syllables[syllableIndex] = syllable;

    puzzle.syllables.splice(bankIndex, 1);
    setInProgressPuzzle(puzzle);
  };

  const unsetSyllable = (wordIndex: number, syllableIndex: number) => {
    const puzzle = cloneDeep(inProgressPuzzle);

    const activeWord = puzzle.words[wordIndex];
    const activeSyllable = activeWord.syllables[syllableIndex];

    puzzle.syllables.push(activeSyllable);

    activeWord.syllables[syllableIndex] = "";
    setInProgressPuzzle(puzzle);
  };

  const onClickWord = (i: number) => {
    setActiveWordIndex(i);
    // useEffect will set the activeSyllableIndex
  };

  const onClickBank = (syllable: string, bankIndex: number) => {
    if (activeSyllableIndex < 0) {
      console.warn("word was full");
      return;
    }

    setSyllable(activeWordIndex, activeSyllableIndex, bankIndex, syllable);
  };

  const onClickSyllable = (
    wordIndex: number,
    syllableIndex: number,
    e: any
  ) => {
    // don't trigger onClickWord if the clicked word is already active
    if (wordIndex === activeWordIndex) e.stopPropagation();

    const activeWord = inProgressPuzzle.words[activeWordIndex];
    if (activeWord.syllables[syllableIndex] !== "") {
      // remove the syllable just clicked
      unsetSyllable(wordIndex, syllableIndex);
    }

    setActiveSyllableIndex(syllableIndex);
  };

  return (
    <div className="game-container">
      {/* {todayWeekday}, {today.toLocaleDateString()} */}
      <div className="game">
        {inProgressPuzzle.words.map((word, i) => (
          <div
            className={`word ${i === activeWordIndex ? "active" : ""}`}
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
                  onClick={(e) => onClickSyllable(i, j, e)}
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
