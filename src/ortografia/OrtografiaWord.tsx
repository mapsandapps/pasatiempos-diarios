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
        {word.spanishWord.split("").map((correctLetter, i) => {
          // for words above active word, show the word
          if (isCompletedWord) {
            return (
              <span key={`${word.spanishWord}-${i}`}>{correctLetter}</span>
            );
          }

          const currentLetter = currentInput[i];

          // for the active word, show correct & incorrect letters
          if (isActiveWord) {
            if (correctLetter?.toLowerCase() === currentLetter?.toLowerCase()) {
              return (
                <span key={`${word.spanishWord}-${i}`}>{correctLetter} </span>
              );
            } else if (
              // since the game objective is spelling from audio, accept un-accented characters
              (correctLetter === "á" && currentLetter === "a") ||
              (correctLetter === "é" && currentLetter === "e") ||
              (correctLetter === "í" && currentLetter === "i") ||
              (correctLetter === "ó" && currentLetter === "o") ||
              (correctLetter === "ú" && currentLetter === "u") ||
              (correctLetter === "ü" && currentLetter === "u")
            ) {
              return (
                <>
                  <span key={`${word.spanishWord}-${i}`}>
                    {correctLetter}
                  </span>{" "}
                </>
              );
            } else if (currentLetter) {
              return (
                <>
                  <span className="incorrect" key={`${word.spanishWord}-${i}`}>
                    {currentLetter}
                  </span>{" "}
                </>
              );
            } else {
              return <span key={`${word.spanishWord}-${i}`}>_ </span>;
            }
          }

          return <span key={`${word.spanishWord}-${i}`}>_ </span>;
        })}
      </pre>
      {isCompletedWord && (
        <img
          className="checkmark"
          src="https://Card.maxcdn.com/v/latest/72x72/2705.png"
        />
      )}
    </div>
  );
}
