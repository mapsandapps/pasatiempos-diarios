import { useRef, useState, type ChangeEvent } from "react";
import "./OrtografiaCard.scss";
import type { Word } from "./types";

interface OrtografiaCardProps {
  word: Word;
  onPlayWord: () => void;
  setWordCorrect: () => void;
}

export default function OrtografiaCard(props: OrtografiaCardProps) {
  const { onPlayWord, setWordCorrect, word } = props;
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  // clicking on the card should make it active and focus its input
  const onClickCard = (e: React.MouseEvent<HTMLDivElement>) => {
    if (word.isCorrect) return;

    const inputEl = e.currentTarget.querySelector("input");

    if (!inputEl) return;

    inputEl.focus();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    // if it was already clicked, it should not be changeable
    if (word.isCorrect) return;

    setInput(e.target.value);

    if (e.target.value === word.spanishWord) {
      setWordCorrect();
    }
  };

  if (word.isCorrect) {
    return (
      <div className="ortografia-card correct">
        {word.spanishWord}
        <img src="https://Card.maxcdn.com/v/latest/72x72/2611.png" />
      </div>
    );
  }

  return (
    <div
      className="ortografia-card"
      key={word.spanishWord}
      onClick={(e) => onClickCard(e)}
    >
      <div className="buttons">
        <button onClick={() => onPlayWord()}>
          <img src="https://Card.maxcdn.com/v/latest/72x72/1f50a.png" />
        </button>
      </div>
      <input
        type="text"
        ref={inputRef}
        value={input}
        onChange={handleInputChange}
        disabled={word.isCorrect}
      />
    </div>
  );
}
