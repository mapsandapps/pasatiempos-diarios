import { isTodayInLocalStorage } from "../utils/localstorage";
import Game from "./Game";
import { random, sample, sampleSize } from "lodash";
import "./ObjetoOculto.scss";
import type { Icon, IconSet, IconToFind, Puzzle } from "./types";
import { iconSets } from "./icons";
import { getTodayString } from "../utils/dates";

const generatePuzzle = (
  minX: number,
  minY: number,
  maxX: number,
  maxY: number
): Puzzle => {
  const iconSet = sample(iconSets) as IconSet;
  const hasArgentinianBias = true;
  const numberToFind = random(10, 20);
  const totalIconsShown = iconSet.icons.length; // for now, just show them all

  if (!iconSet) console.error("no icon set");

  const sampled = sampleSize(iconSet.icons, totalIconsShown);
  const iconsToFind: IconToFind[] = [];
  const otherIcons: Icon[] = [];

  sampled.forEach((icon, i) => {
    if (i < numberToFind) {
      iconsToFind.push({
        filename: icon.filename,
        // if we're using the Argentinian words, pick the first word for each icon, otherwise, pick the 2nd one (if there's more than one)
        spanishWord:
          !hasArgentinianBias && icon.spanishWords[1]
            ? icon.spanishWords[1]
            : icon.spanishWords[0],
        x: random(minX, maxX),
        y: random(minY, maxY),
        hasBeenFound: false,
      });
    } else {
      otherIcons.push({
        filename: icon.filename,
        x: random(minX, maxX),
        y: random(minY, maxY),
      });
    }
  });

  return {
    name: iconSet.name,
    iconDir: iconSet.iconDir,
    iconsToFind,
    otherIcons,
    totalIconsShown,
    hasArgentinianBias,
  };
};

export default function ObjetoOculto() {
  const todayString = getTodayString();
  const puzzleWidth = 468;
  const puzzleHeight = 500;
  const margin = 24;
  const puzzle = generatePuzzle(
    margin,
    margin + 20, // give space for the name of object to find
    puzzleWidth - margin * 2,
    puzzleHeight - margin * 2
  );

  const date = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div id="objeto-oculto">
      <div className="about">
        <h1>Objeto Oculto</h1>
        <div>Find images that match Spanish words</div>
        <div className="date">
          {date}
          {isTodayInLocalStorage("objeto-oculto") && " ✅"}
        </div>
      </div>
      <Game todayString={todayString} puzzle={puzzle} />
    </div>
  );
}
