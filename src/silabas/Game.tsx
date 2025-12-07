import { useState } from "react";
import "./Game.scss";
import { fill, sampleSize } from "lodash";
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

export default function Game(props: GameProps) {
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const solution = getSolution(props.puzzle);
  const [inProgressPuzzle, setInProgressPuzzle] = useState(
    initProgress(solution)
  );

  // // on first render:
  // useEffect(() => {
  //   setInProgressPuzzle()
  // }, [])

  const onClickWord = (i: number) => {
    setActiveWordIndex(i);
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
              {word.syllables.map((syllable, i) => (
                <div
                  className={`${
                    syllable === "" ? "empty-syllable" : ""
                  } syllable`}
                  key={i}
                >
                  {syllable}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div>
          {inProgressPuzzle.syllables.map((syllable, i) => (
            <div className="syllable" key={i}>
              {syllable}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
