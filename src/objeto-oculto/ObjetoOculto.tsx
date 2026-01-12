import { isTodayInLocalStorage } from "../utils/localstorage";
import Game from "./Game";
import "./ObjetoOculto.scss";
import { getTodayString } from "../utils/dates";
import { generatePuzzle } from "./generator";
import { iconSets } from "./icons";
import { useSearchParams } from "react-router";
import { useState } from "react";

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
  const [selectedIconSet, setIconSet] = useState(iconSets[0]);
  const [numberToFind, setNumberToFind] = useState(1);
  const [numberToShow, setNumberToShow] = useState(
    selectedIconSet.icons.length
  );

  const generate = () => {
    // TODO: probably if a puzzle is generated this way, it shouldn't show the date & check mark on the left, and it shouldn't add to localstorage when the user finishes it
    setPuzzle(
      generatePuzzle({
        iconSet: selectedIconSet,
        numberToFind,
        numberToShow,
      })
    );
  };

  return (
    <div id="objeto-oculto">
      <div className="about">
        <h1>Objeto Oculto</h1>
        <div>Find images that match Spanish words</div>
        <div className="date">
          {date}
          {isTodayInLocalStorage("objeto-oculto") && " ✅"}
        </div>
        {isInGeneratorMode && (
          <>
            <div>
              <label htmlFor="iconSet">Icon set</label>
              <br />
              <select
                name="iconSet"
                value={selectedIconSet.name}
                onChange={(e) =>
                  setIconSet(
                    iconSets.find((set) => set.name === e.target.value)!
                  )
                }
              >
                {iconSets.map((set) => (
                  <option key={set.name} value={set.name}>
                    {set.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="numberToFind">Number of icons to find</label>
              <br />
              <input
                type="range"
                name="numberToFind"
                min="1"
                max={selectedIconSet.icons.length}
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
                max={selectedIconSet.icons.length}
                value={numberToShow}
                onChange={(e) => setNumberToShow(Number(e.target.value))}
              />
              {numberToShow}
            </div>
            <div>
              <button className="generate-button" onClick={() => generate()}>
                Generate!
              </button>
            </div>
          </>
        )}
      </div>
      <Game todayString={todayString} puzzle={puzzle} />
    </div>
  );
}
