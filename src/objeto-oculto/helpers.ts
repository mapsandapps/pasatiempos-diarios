import { ICON_SIZE } from "./generator";
import type {
  Icon,
  IconToFind,
  MinimizedIcon,
  MinimizedPuzzle,
  Puzzle,
} from "./types";
import { filter } from "lodash";

export const minifyPuzzle = (puzzle: Puzzle) => {
  const minifiedPuzzle = {
    iconsToFind: [] as MinimizedIcon[],
    otherIcons: [] as MinimizedIcon[],
    name: puzzle.name,
    iconDir: puzzle.iconDir,
    totalIconsShown: puzzle.totalIconsShown,
    hasArgentinianBias: puzzle.hasArgentinianBias,
  };

  puzzle.iconsToFind.forEach((icon) => {
    minifiedPuzzle.iconsToFind.push([
      icon.filename,
      icon.spanishWord,
      icon.x,
      icon.y,
      icon.rotation,
    ]);
  });

  puzzle.otherIcons.forEach((icon) => {
    minifiedPuzzle.otherIcons.push([
      icon.filename,
      icon.spanishWord,
      icon.x,
      icon.y,
      icon.rotation,
    ]);
  });

  return minifiedPuzzle;
};

export const unminifyPuzzle = (puzzle: MinimizedPuzzle) => {
  const unminifiedPuzzle = {
    iconsToFind: [] as IconToFind[],
    otherIcons: [] as Icon[],
    name: puzzle.name,
    iconDir: puzzle.iconDir,
    totalIconsShown: puzzle.totalIconsShown,
    hasArgentinianBias: puzzle.hasArgentinianBias,
  };

  puzzle.iconsToFind.forEach((icon) => {
    unminifiedPuzzle.iconsToFind.push({
      filename: icon[0] as string,
      spanishWord: icon[1],
      x: icon[2],
      y: icon[3],
      rotation: icon[4],
      hasBeenFound: false,
    });
  });

  return unminifiedPuzzle;
};

export const numberRemaining = (iconsToFind: IconToFind[]) => {
  return filter(iconsToFind, ["hasBeenFound", false]).length;
};

export const isClickInIcon = (icon: Icon, clickX: number, clickY: number) => {
  const isXInIcon = clickX >= icon.x && clickX <= icon.x + ICON_SIZE;
  const isYInIcon = clickY >= icon.y && clickY <= icon.y + ICON_SIZE;

  return isXInIcon && isYInIcon;
};
