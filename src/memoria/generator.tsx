import { fill } from "lodash";
import type { IconData } from "../objeto-oculto/types";
import type { MemoriaPuzzle } from "./types";
import { findIndexOfRandomEmptySlot } from "./helpers";

export const generatePuzzle = (
  iconSetName: string,
  iconDir: string,
  emoji: IconData[],
  size: number = 16,
): MemoriaPuzzle => {
  if (emoji.length > size)
    console.warn("more tiles were provided than can be used");
  if (emoji.length < size)
    console.warn("not enough tiles were provided to fill puzzle");

  // @ts-ignore
  const slots = fill(Array(size), undefined) as Slot[];

  emoji.forEach((emoji, i) => {
    if (i + 1 > size) return;

    // place icon in an empty slot
    slots[findIndexOfRandomEmptySlot(slots)] = { emoji, isImage: true };

    // place wordlist in an empty slot
    slots[findIndexOfRandomEmptySlot(slots)] = { emoji, isImage: false };
  });

  return { date: "", name: iconSetName, iconDir, slots };
};
