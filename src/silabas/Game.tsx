import { useState } from "react";
import "./Game.scss";
import { cloneDeep, fill, sampleSize } from "lodash";
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

  console.log(
    "first",
    activeWord.syllables.findIndex((syllable) => syllable === "")
  );
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

  // useEffect(() => {
  //   setActiveSyllableIndex(
  //     findFirstEmptySyllable(activeWordIndex, inProgressPuzzle)
  //   );
  // }, [activeWordIndex, inProgressPuzzle.words[activeWordIndex]]);

  // if syllable index is included, set to that; otherwise set to the first empty syllable in the word
  const setActiveSyllable = (
    activeWordIndex: number,
    puzzleState: Puzzle,
    syllableIndex?: number
  ) => {
    if (syllableIndex) {
      console.log("yes", syllableIndex);
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

    puzzle.syllables.push(activeSyllable);

    activeWord.syllables[syllableIndex] = "";
    setInProgressPuzzle(puzzle);
    setActiveSyllable(wordIndex, puzzle, syllableIndex);
  };

  const onClickWord = (i: number) => {
    console.log("onClickWord", i);
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

  const onClickSyllable = (wordIndex: number, syllableIndex: number) => {
    console.log("onClickSyllable", wordIndex, syllableIndex);

    setActiveSyllableIndex(syllableIndex);

    const activeWord = inProgressPuzzle.words[activeWordIndex];
    if (activeWord.syllables[syllableIndex] !== "") {
      // remove the syllable just clicked
      unsetSyllable(wordIndex, syllableIndex);
    }
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
