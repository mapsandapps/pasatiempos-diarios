import { useEffect, useState, type ChangeEvent } from "react";
import "./MemoriaGenerator.scss";
import type { MemoriaPuzzle, MemoriaMinifiedPuzzle } from "./types";
import type { IconData, IconSet } from "../objeto-oculto/types";
import { iconSets } from "../objeto-oculto/icons";
import { generatePuzzle } from "./generator";
import EmojiTile from "../components/EmojiTile";
import { every, flatten, uniq } from "lodash";
import { minifyPuzzle } from "./helpers";
import { getSettingFromLocalStorage } from "../utils/localstorage";
import { puzzles } from "./puzzles";

export default function MemoriaGenerator() {
  const [puzzle, setPuzzle] = useState<MemoriaPuzzle>();
  const [minifiedPuzzle, setMinifiedPuzzle] = useState<MemoriaMinifiedPuzzle>();
  const [selectedIconSet, setSelectedIconSet] = useState<IconSet>(iconSets[0]);
  const [selectedEmoji, setSelectedEmoji] = useState<IconData[]>([]);
  const [shouldDisplayError, setDisplayError] = useState(false);

  // array of filenames
  const iconsUsedInPreviousPuzzles = uniq(
    flatten(
      puzzles.map((puzzle) => puzzle.pairs.map((pair) => pair.emoji.filename)),
    ),
  );

  // NOTE: this can currently only be changed via the secret settings page
  const [hasArgentinianBias] = useState(
    getSettingFromLocalStorage("hasArgentinianBias") == "true",
  );

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

    const iconData = selectedIconSet.icons.find(
      (icon) => icon.spanishWords[0] === firstSpanishWord,
    ) as IconData;

    if (isChecked && iconsUsedInPreviousPuzzles.includes(iconData?.filename)) {
      setDisplayError(true);
    } else {
      setDisplayError(false);
    }

    setSelectedEmoji((prevItems) => {
      if (isChecked) {
        return [...prevItems, iconData] as IconData[];
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
          <div>
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
          </div>
          {shouldDisplayError && (
            <div className="warning">
              Warning: This icon has been used in a previous puzzle.
            </div>
          )}
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
                  emoji: icon,
                  hasBeenMatched: true,
                  isImage: true,
                }}
                iconDir={selectedIconSet.iconDir}
                isSmall
                hasArgentinianBias={hasArgentinianBias}
                className={
                  !selectedEmoji?.includes(icon) && areSlotsFull
                    ? "disabled"
                    : selectedEmoji?.includes(icon)
                      ? "selected"
                      : iconsUsedInPreviousPuzzles.includes(icon.filename)
                        ? "previously-used"
                        : ""
                }
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
                return <div key={`slot-${i}`} className="emoji-tile" />;
              }
              return (
                <EmojiTile
                  key={`slot-${i}`}
                  slotData={{
                    ...slot,
                    index: i,
                    pairIndex: 0,
                    hasBeenMatched: true,
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
