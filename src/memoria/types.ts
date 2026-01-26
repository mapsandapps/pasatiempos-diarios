import type { IconData } from "../objeto-oculto/types";

export interface Slot {
  emoji: IconData;
  isImage?: boolean;
}

export interface InProgressSlot extends Slot {
  index: number;
  /**
   * there are half as many of these as there are slots,
   * i.e. both slots/tiles for each pair have the same pairIndex
   */
  pairIndex: number;
  hasBeenMatched: boolean;
  numberOfFlips: number;
}

export interface MemoriaPuzzle {
  date: string;
  name: string;
  iconDir: string;
  slots: Slot[];
}

export type MemoriaInProgressPuzzle = InProgressSlot[];
