import { random, sample, sampleSize } from "lodash";
import type { Icon, IconSet, IconToFind, Puzzle } from "./types";
import { iconSets } from "./icons";

export const generatePuzzle = (props?: {
  iconSet: IconSet;
  numberToFind: number;
  numberToShow: number;
}): Puzzle => {
  const puzzleWidth = 468;
  const puzzleHeight = 500;
  const margin = 24;
  const minX = margin;
  const minY = margin + 20; // give space for the name of object to find
  const maxX = puzzleWidth - margin * 2;
  const maxY = puzzleHeight - margin * 2;

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
      iconsToFind.push({
        filename: icon.filename,
        // if we're using the Argentinian words, pick the first word for each icon, otherwise, pick the 2nd one (if there's more than one)
        spanishWord:
          !hasArgentinianBias && icon.spanishWords[1]
            ? icon.spanishWords[1]
            : icon.spanishWords[0],
        x: random(minX, maxX),
        y: random(minY, maxY),
        rotation: random(-75, 75),
        hasBeenFound: false,
      });
    } else {
      otherIcons.push({
        filename: icon.filename,
        x: random(minX, maxX),
        y: random(minY, maxY),
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
