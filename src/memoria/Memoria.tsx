import { useSearchParams } from "react-router";
import PuzzleDate from "../components/PuzzleDate";
import "./Memoria.scss";
import { getTodayString } from "../utils/dates";
import { useEffect, useState, type ChangeEvent } from "react";
import { getSettingFromLocalStorage } from "../utils/localstorage";
import { GameString } from "../types";
import { type IconData, type IconSet } from "../objeto-oculto/types";
import { iconSets } from "../objeto-oculto/icons";
import EmojiTile from "../components/EmojiTile";
import { generatePuzzle } from "./generator";
import type { MemoriaPuzzle } from "./types";
import MemoriaGame from "./MemoriaGame";

export default function Memoria() {
  const todayString = getTodayString();
  const [searchParams] = useSearchParams();
  const queryParamDate = searchParams.get("date");
  const [isDailyPuzzle] = useState(
    queryParamDate && queryParamDate !== todayString ? false : true,
  );
  const [puzzle, setPuzzle] = useState<MemoriaPuzzle>();
  const puzzleDate = isDailyPuzzle ? todayString : queryParamDate || undefined;

  const includesColors = false;
  // is the puzzle using colorblind mode? true if the user has the setting on and the puzzle involves colors
  const [isInColorblindMode, setColorblindMode] = useState(false);
  // does the user want colorblind mode on when relevant?
  const [prefersColorblindMode, setPrefersColorblindMode] = useState(
    getSettingFromLocalStorage("prefersColorblindMode") == "true",
  );

  const hasArgentinianBias = true;

  // generator stuff:
  const isInGeneratorMode = searchParams.get("generate") === "true";
  const [selectedIconSet, setSelectedIconSet] = useState<IconSet>(iconSets[0]);
  const [selectedEmoji, setSelectedEmoji] = useState<IconData[]>([]);

  const handleColorblindOnChange = () => {
    setPrefersColorblindMode(!prefersColorblindMode);
  };

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

  const areSlotsFull = selectedEmoji.length >= (puzzle?.slots.length || 0) / 2;

  // onInit
  useEffect(() => {
    if (isInGeneratorMode) {
      setPuzzle(undefined);
      return;
    }
  }, []);

  useEffect(() => {
    if (includesColors) {
      // if it's in localstorage, turn it on, otherwise, turn it off
      if (prefersColorblindMode) {
        setColorblindMode(true);
      } else {
        setColorblindMode(false);
      }
    } else {
      // not relevant if the puzzle doesn't involve colors
      setColorblindMode(false);
    }
  }, [includesColors, prefersColorblindMode]);

  useEffect(() => {
    if (!isInGeneratorMode) return;

    const puzzle = generatePuzzle(
      selectedIconSet.name,
      selectedIconSet.iconDir,
      selectedEmoji,
    );

    setPuzzle(puzzle);
  }, [isInGeneratorMode, selectedEmoji]);

  return (
    <div id="memoria">
      {isInGeneratorMode && (
        <div className="sticky">
          {selectedEmoji.length}/{(puzzle?.slots.length || 0) / 2}
        </div>
      )}
      <div className="about">
        <h1>Memoria</h1>
        {!isInGeneratorMode && (
          <div>Match images with their names in Spanish</div>
        )}
        <PuzzleDate
          puzzleDate={puzzleDate}
          isDailyPuzzle={isDailyPuzzle}
          isInGeneratorMode={isInGeneratorMode}
          puzzleLocalStorageString={GameString.Memoria}
        />
        {/* if the puzzle includes colors, add colorblindness mode option */}
        {includesColors && (
          <label className="colorblind-input">
            <input
              type="checkbox"
              name="colorblind-mode"
              checked={prefersColorblindMode}
              onChange={handleColorblindOnChange}
            />
            Colorblind Mode
          </label>
        )}
        {isInGeneratorMode && (
          <div className="generator-settings">
            <label>
              Choose an icon set:
              <select value={selectedIconSet.name} onChange={handleSetChange}>
                {iconSets.map((iconSet) => (
                  <option key={iconSet.name} value={iconSet.name}>
                    {iconSet.name}
                  </option>
                ))}
              </select>
            </label>
            {selectedIconSet.icons.map((icon) => (
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
                  icon={icon}
                  iconDir={selectedIconSet.iconDir}
                  isImage
                  isSmall
                />
                <EmojiTile
                  icon={icon}
                  iconDir={selectedIconSet.iconDir}
                  hasArgentinianBias={hasArgentinianBias}
                  isSmall
                />
              </label>
            ))}
          </div>
        )}
      </div>
      <div>
        {puzzle && (
          <MemoriaGame
            todayString={todayString}
            puzzle={puzzle}
            isDailyPuzzle={isDailyPuzzle}
            isInColorblindMode={isInColorblindMode}
            hasArgentinianBias={hasArgentinianBias}
          />
        )}
        {isInGeneratorMode && areSlotsFull && (
          <textarea value={JSON.stringify(puzzle)} readOnly />
        )}
      </div>
    </div>
  );
}
