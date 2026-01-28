import { useEffect, useState } from "react";
import "./Generator.scss";
import { words as wordList } from "./words";
import { join, sample } from "lodash";
import { getSyllables } from "../utils/syllable-parser";
import Game from "./Game";
import { minifyWord } from "./helpers";

interface Word {
  definition: string;
  spanish: string;
  syllables?: string[];
  /** has been selected by user for inclusion in the puzzle */
  isIncluded: boolean;
}

export default function Generator() {
  const [proposedWords, setProposedWords] = useState<Word[]>([]);
  const [puzzle, setPuzzle] = useState<string[]>();

  const NUMBER_OF_WORDS_TO_CHOOSE_FROM = 10;

  const numberOfWordsSelected = proposedWords.filter(
    (word) => word.isIncluded,
  ).length;

  const handleCheckboxChange = (wordIndex: number) => {
    setProposedWords((prevItems) => {
      return prevItems.map((word, i) => {
        return i === wordIndex
          ? { ...word, isIncluded: !word.isIncluded }
          : word;
      });
    });
  };

  const getRandomWord = (): Word => {
    const [spanish, definition] = sample(wordList) as [string, string];

    return {
      spanish,
      definition,
      syllables: getSyllables(spanish),
      isIncluded: false,
    };
  };

  const resetOptions = () => {
    setPuzzle(undefined);
    setProposedWords([]);
    const wordsInPuzzle: Word[] = [];

    for (let i = 0; i < NUMBER_OF_WORDS_TO_CHOOSE_FROM; i++) {
      wordsInPuzzle.push(getRandomWord());
    }

    setProposedWords(wordsInPuzzle);
  };

  const reroll = () => {
    setProposedWords((prevItems) => {
      return prevItems.map((word) => {
        return word.isIncluded ? word : getRandomWord();
      });
    });
  };

  const createPuzzle = () => {
    const words = proposedWords.filter((word) => word.isIncluded);
    const minifiedWords: string[] = [];
    words.forEach((word) => {
      const syllables = word.syllables ?? getSyllables(word.spanish);
      minifiedWords.push(minifyWord(word.definition, syllables));
    });

    setPuzzle(minifiedWords);
  };

  // onInit
  useEffect(() => {
    resetOptions();
  }, []);

  return (
    <div id="silabas-generator">
      <button onClick={resetOptions}>
        {puzzle ? "Create New Puzzle" : "Reset With New Words"}
      </button>
      {!puzzle && (
        <>
          <div className="p">
            Select 5 to create a puzzle, or select fewer and reroll the rest:
          </div>
          {proposedWords.map((word, i) => (
            <div key={i}>
              <label>
                <input
                  type="checkbox"
                  value={word.spanish}
                  checked={word.isIncluded}
                  onChange={() => handleCheckboxChange(i)}
                />
                {word.definition}: {word.spanish} ({join(word.syllables, "·")})
              </label>
            </div>
          ))}
          {numberOfWordsSelected > 0 && numberOfWordsSelected < 5 && (
            <button onClick={reroll}>Reroll Unchecked</button>
          )}
          {numberOfWordsSelected > 5 && (
            <div className="p">⚠️ Please select no more than 5 words</div>
          )}
          {numberOfWordsSelected === 5 && (
            <button onClick={createPuzzle}>Display Puzzle With Words</button>
          )}
        </>
      )}
      {puzzle && (
        <>
          <Game todayString="" puzzle={puzzle} />
          <textarea value={JSON.stringify({ date: "", puzzle })} readOnly />
        </>
      )}
    </div>
  );
}
