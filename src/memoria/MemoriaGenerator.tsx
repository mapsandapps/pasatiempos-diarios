import { useEffect, useState, type ChangeEvent } from "react";
import "./MemoriaGenerator.scss";
import type { MemoriaPuzzle, MemoriaMinifiedPuzzle } from "./types";
import type { IconData, IconSet } from "../objeto-oculto/types";
import { iconSets } from "../objeto-oculto/icons";
import { generatePuzzle } from "./generator";
import EmojiTile from "../components/EmojiTile";
import { every } from "lodash";
import { minifyPuzzle } from "./helpers";

export default function MemoriaGenerator() {
  const [puzzle, setPuzzle] = useState<MemoriaPuzzle>();
  const [minifiedPuzzle, setMinifiedPuzzle] = useState<MemoriaMinifiedPuzzle>();

  // generator stuff:
  const [selectedIconSet, setSelectedIconSet] = useState<IconSet>(iconSets[0]);
  const [selectedEmoji, setSelectedEmoji] = useState<IconData[]>([]);

  const handleSetChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedEmoji([]);

    const selectedSet = iconSets.find(
      (iconSet) => iconSet.name === e.target.value,
    );
    if (selectedSet) setSelectedIconSet(selectedSet);
  };

  const handleEmojiChange = (e: ChangeEvent<HTMLInputElement>) => {
    const firstSpanishWord = e.target.name;
    const isChecked = e.target.checked;

    setSelectedEmoji((prevItems) => {
      if (isChecked) {
        return [
          ...prevItems,
          selectedIconSet.icons.find(
            (icon) => icon.spanishWords[0] === firstSpanishWord,
          ),
        ] as IconData[];
      } else {
        return prevItems.filter(
          (icon) => icon.spanishWords[0] !== firstSpanishWord,
        );
      }
    });
  };

  const areSlotsFull = puzzle ? every(puzzle?.slots, Boolean) : false;

  useEffect(() => {
    if (areSlotsFull) {
      setMinifiedPuzzle(minifyPuzzle(puzzle!));
    }
  }, [areSlotsFull]);

  useEffect(() => {
    const puzzle = generatePuzzle(
      selectedIconSet.name,
      selectedIconSet.iconDir,
      selectedEmoji,
    );

    setPuzzle(puzzle);
  }, [selectedEmoji]);

  return (
    <div id="memoria-generator">
      <div className="left-column">
        <div className="sticky">
          {selectedEmoji.length}/{(puzzle?.slots.length || 0) / 2}
        </div>
        <div className="generator-settings">
          <label>
            Choose an icon set:
            <br />
            <select value={selectedIconSet.name} onChange={handleSetChange}>
              {iconSets.map((iconSet) => (
                <option key={iconSet.name} value={iconSet.name}>
                  {iconSet.name}
                </option>
              ))}
            </select>
          </label>
          {selectedIconSet.icons.map((icon, i) => (
            <label
              key={`per-icon${icon.spanishWords[0]}`}
              className="tile-pair"
            >
              <input
                type="checkbox"
                name={icon.spanishWords[0]}
                checked={selectedEmoji?.includes(icon)}
                onChange={handleEmojiChange}
                disabled={!selectedEmoji?.includes(icon) && areSlotsFull}
              />
              <EmojiTile
                slotData={{
                  index: i,
                  pairIndex: 0,
                  numberOfFlips: 0,
                  emoji: icon,
                  hasBeenMatched: true,
                  isImage: true,
                }}
                iconDir={selectedIconSet.iconDir}
                isSmall
              />
            </label>
          ))}
        </div>
      </div>
      <div className="right-column">
        <div id="game">
          {puzzle &&
            puzzle.slots.map((slot, i) => {
              if (!slot || !slot.emoji) {
                return (
                  <div key={`slot-${i}`} className="emoji-tile empty-tile" />
                );
              }
              return (
                <EmojiTile
                  key={`slot-${i}`}
                  slotData={{
                    ...slot,
                    index: i,
                    pairIndex: 0,
                    hasBeenMatched: true,
                    numberOfFlips: 0,
                  }}
                  iconDir={puzzle.iconDir}
                  hasArgentinianBias
                />
              );
            })}
        </div>
        {areSlotsFull && (
          <textarea value={JSON.stringify(minifiedPuzzle)} readOnly />
        )}
      </div>
    </div>
  );
}
