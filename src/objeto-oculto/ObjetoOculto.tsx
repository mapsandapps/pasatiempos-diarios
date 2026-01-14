import { isTodayInLocalStorage } from "../utils/localstorage";
import Game from "./Game";
import "./ObjetoOculto.scss";
import { getTodayString } from "../utils/dates";
import { generatePuzzle, MAX_ITEMS_TO_INCLUDE } from "./generator";
import { iconSets } from "./icons";
import { useSearchParams } from "react-router";
import { useEffect, useState, type ChangeEvent } from "react";
import { combineIconSets, minifyPuzzle } from "./helpers";
import type { IconSet } from "./types";

export default function ObjetoOculto() {
  const todayString = getTodayString();
  const [puzzle, setPuzzle] = useState(generatePuzzle({})); // TODO: later, these will come from a list of stored puzzles, so everyone has the same one

  const date = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // generator stuff:
  const [searchParams] = useSearchParams();
  const isInGeneratorMode = searchParams.get("generate");
  const [selectedIconSets, setSelectedIconSets] = useState<IconSet[]>([]);
  const [numberOfIconsInSet, setNumberOfIconsInSet] = useState(0); // set below in useEffect
  const [numberToFind, setNumberToFind] = useState(1);
  const [numberToShow, setNumberToShow] = useState(0); // set below in useEffect
  const [shouldShowMinified, setShouldShowMinified] = useState(true);
  const [isDailyPuzzle, setDailyPuzzle] = useState(true);

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

  useEffect(() => {
    const combinedSets = combineIconSets(selectedIconSets);
    setNumberToShow(Math.min(combinedSets.icons.length, MAX_ITEMS_TO_INCLUDE));
    setNumberOfIconsInSet(combinedSets.icons.length);
  }, [selectedIconSets]);

  return (
    <div id="objeto-oculto">
      <div className="about">
        <h1>Objeto Oculto</h1>
        {isDailyPuzzle ? (
          <>
            <div>Find images that match Spanish words</div>
            <div className="date">
              {date}
              {isTodayInLocalStorage("objeto-oculto") && " ✅"}
            </div>
          </>
        ) : (
          <div className="date">User-generated puzzle</div>
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
                <label>
                  <input
                    type="checkbox"
                    checked={shouldShowMinified}
                    onChange={() => setShouldShowMinified(!shouldShowMinified)}
                  />
                  Show minified puzzle
                </label>
                <textarea
                  value={
                    shouldShowMinified
                      ? JSON.stringify(minifyPuzzle(puzzle))
                      : JSON.stringify(puzzle)
                  }
                  readOnly
                />
              </>
            )}
          </>
        )}
      </div>
      <Game
        todayString={todayString}
        puzzle={puzzle}
        isDailyPuzzle={isDailyPuzzle}
      />
    </div>
  );
}
