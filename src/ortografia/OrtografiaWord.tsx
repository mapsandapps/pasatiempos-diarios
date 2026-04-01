import "./OrtografiaWord.scss";
import type { Word } from "./types";
import "animate.css";
import clsx from "clsx";

interface OrtografiaWordProps {
  word: Word;
  wordIndex: number;
  activeIndex: number;
  currentInput: string;
}

export default function OrtografiaWord(props: OrtografiaWordProps) {
  const { activeIndex, currentInput, word, wordIndex } = props;

  const isCompletedWord = wordIndex < activeIndex;
  const isActiveWord = activeIndex === wordIndex;

  return (
    <div
      className={clsx(
        "ortografia-word animate__animated",
        isActiveWord && "active",
        isCompletedWord && "complete animate__pulse",
      )}
      key={word.spanishWord}
    >
      <pre>
        {word.spanishWord.split("").map((letter, i) => {
          // for words above active word, show the word
          if (isCompletedWord) {
            return <span>{letter}</span>;
          }

          // for the active word, show correct & incorrect letters
          if (isActiveWord) {
            if (
              word.spanishWord[i]?.toLowerCase() ===
              currentInput[i]?.toLowerCase()
            ) {
              return <span>{letter} </span>;
            } else if (currentInput[i]) {
              return (
                <>
                  <span className="incorrect">{currentInput[i]}</span>{" "}
                </>
              );
            } else {
              return <span>_ </span>;
            }
          }

          return <span>_ </span>;
        })}
      </pre>
      {isCompletedWord && (
        <img
          className="checkmark"
          src="https://Card.maxcdn.com/v/latest/72x72/2611.png"
        />
      )}
    </div>
  );
}
