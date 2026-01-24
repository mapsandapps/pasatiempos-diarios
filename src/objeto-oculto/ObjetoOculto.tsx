import {
  addSettingToLocalStorage,
  getSettingFromLocalStorage,
} from "../utils/localstorage";
import Game from "./Game";
import "./ObjetoOculto.scss";
import { getPuzzleForDate, getTodayString } from "../utils/dates";
import {
  generatePuzzle,
  MAX_DEFAULT_ITEMS_TO_FIND,
  MAX_ITEMS_TO_INCLUDE,
} from "./generator";
import { iconSets } from "./icons";
import { useSearchParams } from "react-router";
import { useEffect, useState, type ChangeEvent } from "react";
import { combineIconSets, minifyPuzzle, unminifyPuzzle } from "./helpers";
import type { IconSet, MinifiedPuzzle, Puzzle } from "./types";
import { GameString } from "../types";
import PuzzleDate from "../components/PuzzleDate.tsx";

export default function ObjetoOculto() {
  const todayString = getTodayString();
  const [searchParams] = useSearchParams();
  const queryParamDate = searchParams.get("date");
  const [isDailyPuzzle, setDailyPuzzle] = useState(
    queryParamDate && queryParamDate !== todayString ? false : true
  );
  const [puzzle, setPuzzle] = useState<Puzzle>();

  // generator stuff:
  const isInGeneratorMode = searchParams.get("generate");
  const [selectedIconSets, setSelectedIconSets] = useState<IconSet[]>([]);
  const [numberOfIconsInSet, setNumberOfIconsInSet] = useState(0); // set below in useEffect
  const [numberToFind, setNumberToFind] = useState(1);
  const [numberToShow, setNumberToShow] = useState(0); // set below in useEffect
  const [shouldShowMinified, setShouldShowMinified] = useState(true);
  // is the puzzle using colorblind mode? true if the user has the setting on and the puzzle involves colors
  const [isInColorblindMode, setColorblindMode] = useState(false);
  // does the user want colorblind mode on when relevant?
  const [prefersColorblindMode, setPrefersColorblindMode] = useState(
    getSettingFromLocalStorage("prefersColorblindMode") == "true"
  );

  const includesColors = puzzle?.name.toLowerCase().includes("color");

  const generate = () => {
    setDailyPuzzle(false);
    setPuzzle(
      generatePuzzle({
        iconSets: selectedIconSets,
        numberToFind,
        numberToShow,
      })
    );
  };

  const handleSetsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const itemName = e.target.name;
    const isChecked = e.target.checked;

    setSelectedIconSets((prevItems) => {
      if (isChecked) {
        return [
          ...prevItems,
          iconSets.find((set) => set.name === itemName),
        ] as IconSet[];
      } else {
        return prevItems.filter((item) => item.name !== itemName);
      }
    });
  };

  const handleColorblindOnChange = () => {
    setPrefersColorblindMode(!prefersColorblindMode);
  };

  // onInit
  useEffect(() => {
    const puzzle = getPuzzleForDate(
      GameString.ObjetoOculto,
      queryParamDate || todayString
    ) as MinifiedPuzzle;

    setPuzzle(unminifyPuzzle(puzzle));
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
    const combinedSets = combineIconSets(selectedIconSets);
    setNumberToShow(Math.min(combinedSets.icons.length, MAX_ITEMS_TO_INCLUDE));
    setNumberToFind(
      Math.min(combinedSets.icons.length, MAX_DEFAULT_ITEMS_TO_FIND)
    );
    setNumberOfIconsInSet(combinedSets.icons.length);
  }, [selectedIconSets]);

  // save colorblind preference to localstorage whenever it changes
  useEffect(() => {
    addSettingToLocalStorage("prefersColorblindMode", prefersColorblindMode);
  }, [prefersColorblindMode]);

  const puzzleDate = isDailyPuzzle ? todayString : queryParamDate || undefined;

  return (
    <div id="objeto-oculto">
      <div className="about">
        <h1>Objeto Oculto</h1>
        <div>Find images that match Spanish words</div>
        <PuzzleDate
          puzzleDate={puzzleDate}
          isDailyPuzzle={isDailyPuzzle}
          isUserGenerated={!isDailyPuzzle && !queryParamDate}
          puzzleLocalStorageString={GameString.ObjetoOculto}
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
          <>
            <div>
              Icon sets:
              <br />
              {iconSets.map((set) => (
                <label className="iconset-checkbox" key={set.name}>
                  <input
                    type="checkbox"
                    name={set.name}
                    checked={selectedIconSets?.includes(set)}
                    onChange={handleSetsChange}
                  />
                  {set.name}
                </label>
              ))}
            </div>
            <div>
              <label htmlFor="numberToFind">Number of icons to find</label>
              <br />
              <input
                type="range"
                name="numberToFind"
                min="1"
                max={Math.min(numberOfIconsInSet, MAX_ITEMS_TO_INCLUDE)}
                value={numberToFind}
                onChange={(e) => setNumberToFind(Number(e.target.value))}
              />
              {numberToFind}
            </div>
            <div>
              <label htmlFor="numberToShow">Number of icons to display</label>
              <br />
              <input
                type="range"
                name="numberToShow"
                min={numberToFind}
                max={Math.min(numberOfIconsInSet, MAX_ITEMS_TO_INCLUDE)}
                value={numberToShow}
                onChange={(e) => setNumberToShow(Number(e.target.value))}
                disabled={numberToFind === numberToShow}
              />
              {numberToFind === numberToShow ? "All" : numberToShow}
            </div>
            <div>
              <button
                className="generate-button"
                onClick={() => generate()}
                disabled={selectedIconSets.length < 1}
              >
                Generate!
              </button>
            </div>
            {!isDailyPuzzle && (
              <>
                <hr />
                <div>Output:</div>
                <label>
                  <input
                    type="checkbox"
                    checked={shouldShowMinified}
                    onChange={() => setShouldShowMinified(!shouldShowMinified)}
                  />
                  Minify
                </label>
                {puzzle && (
                  <textarea
                    value={
                      shouldShowMinified
                        ? JSON.stringify(minifyPuzzle(puzzle))
                        : JSON.stringify(puzzle)
                    }
                    readOnly
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
      {puzzle && (
        <Game
          todayString={todayString}
          puzzle={puzzle}
          isDailyPuzzle={isDailyPuzzle}
          isInColorblindMode={isInColorblindMode}
        />
      )}
    </div>
  );
}
