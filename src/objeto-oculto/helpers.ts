import { ICON_SIZE } from "./generator";
import type {
  CombinedIconSet,
  Icon,
  IconData,
  IconDataWithPath,
  IconSet,
  IconToFind,
  MinifiedIcon,
  MinifiedPuzzle,
  Puzzle,
} from "./types";
import { filter, includes, range, sample, some } from "lodash";

export const minifyPuzzle = (puzzle: Puzzle) => {
  const minifiedPuzzle: MinifiedPuzzle = {
    date: puzzle.date,
    name: puzzle.name,
    iconsToFind: [] as MinifiedIcon[],
    otherIcons: [] as MinifiedIcon[],
    totalIconsShown: puzzle.totalIconsShown,
    hasArgentinianBias: puzzle.hasArgentinianBias,
  };

  puzzle.iconsToFind.forEach((icon) => {
    minifiedPuzzle.iconsToFind.push([
      icon.filePath,
      icon.spanishWord,
      icon.x,
      icon.y,
      icon.rotation,
    ]);
  });

  puzzle.otherIcons.forEach((icon) => {
    minifiedPuzzle.otherIcons.push([
      icon.filePath,
      icon.spanishWord,
      icon.x,
      icon.y,
      icon.rotation,
    ]);
  });

  return minifiedPuzzle;
};

export const unminifyPuzzle = (puzzle: MinifiedPuzzle) => {
  const unminifiedPuzzle: Puzzle = {
    date: puzzle.date,
    name: puzzle.name,
    iconsToFind: [] as IconToFind[],
    otherIcons: [] as Icon[],
    totalIconsShown: puzzle.totalIconsShown,
    hasArgentinianBias: puzzle.hasArgentinianBias,
  };

  puzzle.iconsToFind.forEach((icon) => {
    unminifiedPuzzle.iconsToFind.push({
      filePath: icon[0] as string,
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

export const hasNameInCommon = (a: string[], b: string[]): boolean => {
  return some(a, (item) => includes(b, item));
};

export const hasFilePathBeenUsed = (
  filePath: string,
  icons: IconDataWithPath[],
) => {
  const usedFilePaths = icons.map((icon) => icon.filePath);

  return includes(usedFilePaths, filePath);
};

export const getFullPathForIcon = (
  iconDir: string,
  iconFilename: string,
): string => {
  return `${iconDir}/${iconFilename}`;
};

export const combineIconSets = (iconSets: IconSet[]): CombinedIconSet => {
  // Source - https://stackoverflow.com/questions/16251822/array-to-comma-separated-string-and-for-last-tag-use-the-and-instead-of-comma
  // Posted by cipher, modified by community. See post 'Timeline' for change history
  // Retrieved 2026-01-14, License - CC BY-SA 3.0

  // if there are lots of sets, don't list them all
  const name =
    iconSets.length > 5
      ? "Everything"
      : iconSets
          .map((set) => set.name)
          .join(", ")
          .replace(/,(?!.*,)/gim, " and");

  const iconSet: CombinedIconSet = {
    name,
    icons: [],
  };
  const usedSpanishWords: string[] = [];

  iconSets.forEach((set) => {
    set.icons.forEach((icon) => {
      const filePath = getFullPathForIcon(set.iconDir, icon.filename);

      // if this icon has the same spanish translation as another icon
      // or if the icon has the same filePath as another icon
      // don't include it
      if (
        hasNameInCommon(icon.spanishWords, usedSpanishWords) ||
        hasFilePathBeenUsed(filePath, iconSet.icons)
      ) {
        // no-op
      } else {
        iconSet.icons.push({
          spanishWords: icon.spanishWords,
          filePath,
        });
      }
    });
  });

  return iconSet;
};

export const getSpanishWord = (
  hasArgentinianBias: boolean,
  icon: IconDataWithPath | IconData,
) => {
  // if we're using the Argentinian words, pick the first word for each icon, otherwise, pick the 2nd one (if there's more than one)

  if (hasArgentinianBias) return icon.spanishWords[0];
  if (icon.spanishWords[1]) return icon.spanishWords[1];
  return icon.spanishWords[0];
};

// recursive
export const findAcceptablePosition = (
  icons: Icon[],
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
  attempts: number = 0,
): { x: number; y: number } => {
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

export const findPosition = (
  iconsToFind: IconToFind[],
  otherIcons: Icon[],
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
) => {
  const allIcons = [...iconsToFind, ...otherIcons];

  const { x, y } = findAcceptablePosition(allIcons, minX, maxX, minY, maxY);

  return {
    x,
    y,
  };
};

const englishNamesOfColors = [
  { spanish: "rojo", english: "red" },
  { spanish: "naranja", english: "orange" },
  { spanish: "amarillo", english: "yellow" },
  { spanish: "verde", english: "green" },
  { spanish: "azul", english: "blue" },
  { spanish: "morado", english: "purple" },
  { spanish: "café", english: "brown" },
  { spanish: "negro", english: "black" },
  { spanish: "blanco", english: "white" },
];

export const getEnglishNameOfColor = (spanishWord: string): string => {
  return (
    englishNamesOfColors.find((obj) => {
      return obj.spanish === spanishWord;
    })?.english || ""
  );
};
