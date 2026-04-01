import { useRef, useState, type ChangeEvent } from "react";
import "./OrtografiaCard.scss";
import type { Word } from "./types";
import clsx from "clsx";

interface OrtografiaCardProps {
  word: Word;
  isAudioPlaying: boolean;
  onPlayWord: () => void;
  setWordCorrect: () => void;
}

// TODO: play audio when field is focused

export default function OrtografiaCard(props: OrtografiaCardProps) {
  const { isAudioPlaying, onPlayWord, setWordCorrect, word } = props;
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  // clicking on the card should make it active and focus its input and play the audio
  const onClickCard = (e: React.MouseEvent<HTMLDivElement>) => {
    if (word.isCorrect) return;

    const inputEl = e.currentTarget.querySelector("input");

    if (!inputEl) return;

    onPlayWord();
    inputEl.focus();
  };

  const onClickButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClickCard(e);
  };

  const handleFocus = () => {
    if (isAudioPlaying) return;

    onPlayWord();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    // if it was already clicked, it should not be changeable
    if (word.isCorrect) return;

    setInput(e.target.value);

    if (e.target.value === word.spanishWord) {
      setWordCorrect();
      // TODO: focus next card
    }
  };

  return (
    <div
      className={clsx("ortografia-card", word.isCorrect && "correct")}
      key={word.spanishWord}
      onClick={(e) => onClickCard(e)}
    >
      {word.isCorrect ? (
        <img
          className="checkmark"
          src="https://Card.maxcdn.com/v/latest/72x72/2611.png"
        />
      ) : (
        <button onClick={() => onPlayWord()} disabled={word.isCorrect}>
          {isAudioPlaying ? (
            <img src="https://Card.maxcdn.com/v/latest/72x72/23f9.png" />
          ) : (
            <img src="https://Card.maxcdn.com/v/latest/72x72/25b6.png" />
          )}
        </button>
      )}
      <input
        name={word.spanishWord}
        type="text"
        ref={inputRef}
        value={input}
        onFocus={handleFocus}
        onChange={handleInputChange}
        disabled={word.isCorrect}
      />
      {/* {[...word.spanishWord].map(() => (
                <>_ </>
              ))} */}
    </div>
  );
}
