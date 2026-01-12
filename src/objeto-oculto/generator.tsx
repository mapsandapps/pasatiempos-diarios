import { random, range, sample, sampleSize } from "lodash";
import type { Icon, IconSet, IconToFind, Puzzle } from "./types";
import { iconSets } from "./icons";

const ICON_SIZE = 48;
const PUZZLE_WIDTH = 468;
const PUZZLE_HEIGHT = 500;

// recursive
const findAcceptablePosition = (
  icons: Icon[],
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
  attempts: number = 0
) => {
  if (attempts > 5) {
    console.warn("lots of recursion happening...");
  }
  if (attempts > 25) {
    console.error("too much recursion!");
    return { x: minX, y: minY };
  }
  const BUFFER = ICON_SIZE / 2; // the amount of overlap to avoid
  const GRID_SPACING = 8;

  const xOptions = range(minX, maxX + 1, GRID_SPACING);
  const yOptions = range(minY, maxY + 1, GRID_SPACING);

  if (xOptions.length < 1 || yOptions.length < 1) {
    console.error("no options for position");
    return { x: 0, y: 0 };
  }

  const potentialX = sample(xOptions) as number;
  const potentialY = sample(yOptions) as number;

  let isPositionGood = true;

  icons.forEach((icon) => {
    if (
      Math.abs(icon.x - potentialX) < BUFFER &&
      Math.abs(icon.y - potentialY) < BUFFER
    ) {
      isPositionGood = false;
    }
  });

  if (isPositionGood) {
    return { x: potentialX, y: potentialY };
  } else {
    return findAcceptablePosition(icons, minX, maxX, minY, maxY, attempts + 1);
  }
};

const findPosition = (
  iconsToFind: IconToFind[],
  otherIcons: Icon[],
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
) => {
  const allIcons = [...iconsToFind, ...otherIcons];

  const { x, y } = findAcceptablePosition(allIcons, minX, maxX, minY, maxY);

  return {
    x,
    y,
  };
};

export const generatePuzzle = (props: {
  iconSet?: IconSet;
  numberToFind?: number;
  numberToShow?: number;
}): Puzzle => {
  const margin = 24;
  const minX = margin;
  const minY = 20; // give space for the name of object to find
  const maxX = PUZZLE_WIDTH - ICON_SIZE - margin;
  const maxY = PUZZLE_HEIGHT - ICON_SIZE;

  const iconSet = props?.iconSet || (sample(iconSets) as IconSet);
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
        filename: icon.filename,
        // if we're using the Argentinian words, pick the first word for each icon, otherwise, pick the 2nd one (if there's more than one)
        spanishWord:
          !hasArgentinianBias && icon.spanishWords[1]
            ? icon.spanishWords[1]
            : icon.spanishWords[0],
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
        filename: icon.filename,
        x,
        y,
        rotation: random(-75, 75),
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
