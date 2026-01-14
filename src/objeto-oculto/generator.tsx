import { random, sample, sampleSize } from "lodash";
import type { Icon, IconSet, IconToFind, Puzzle } from "./types";
import { iconSets as allIconSets } from "./icons";
import { combineIconSets, findPosition, getSpanishWord } from "./helpers";

export const ICON_SIZE = 48;
const PUZZLE_WIDTH = 468;
const PUZZLE_HEIGHT = 500;

export const generatePuzzle = (props: {
  iconSets?: IconSet[];
  numberToFind?: number;
  numberToShow?: number;
}): Puzzle => {
  const margin = 24;
  const minX = margin;
  const minY = 20; // give space for the name of object to find
  const maxX = PUZZLE_WIDTH - ICON_SIZE - margin;
  const maxY = PUZZLE_HEIGHT - ICON_SIZE;

  // NOTE: we need to use `combineIconSets` even on a single to get the full paths for the icons
  const iconSet = combineIconSets(
    props.iconSets || [sample(allIconSets) as IconSet]
  );

  const hasArgentinianBias = true;
  // numberToFind should never exceed the number of icons
  const minNumberToFind = Math.min(10, iconSet.icons.length);
  const maxNumberToFind = Math.min(20, iconSet.icons.length);
  const numberToFind =
    props?.numberToFind || random(minNumberToFind, maxNumberToFind);
  const totalIconsShown = props?.numberToShow || iconSet.icons.length; // for now, just show them all

  if (!iconSet) console.error("no icon set");

  const sampled = sampleSize(iconSet.icons, totalIconsShown);
  const iconsToFind: IconToFind[] = [];
  const otherIcons: Icon[] = [];

  sampled.forEach((icon, i) => {
    if (i < numberToFind) {
      const { x, y } = findPosition(
        iconsToFind,
        otherIcons,
        minX,
        maxX,
        minY,
        maxY
      );

      iconsToFind.push({
        filePath: `${icon.filePath}`,
        spanishWord: getSpanishWord(hasArgentinianBias, icon),
        x,
        y,
        rotation: random(-75, 75),
        hasBeenFound: false,
      });
    } else {
      const { x, y } = findPosition(
        iconsToFind,
        otherIcons,
        minX,
        maxX,
        minY,
        maxY
      );

      otherIcons.push({
        filePath: `${icon.filePath}`,
        spanishWord: getSpanishWord(hasArgentinianBias, icon),
        x,
        y,
        rotation: random(-75, 75),
      });
    }
  });

  return {
    name: iconSet.name,
    iconsToFind,
    otherIcons,
    totalIconsShown,
    hasArgentinianBias,
  };
};
