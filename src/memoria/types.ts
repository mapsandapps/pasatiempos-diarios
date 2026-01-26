import type { IconData } from "../objeto-oculto/types";

export interface Slot {
  emoji: IconData;
  isImage?: boolean;
  pairIndex: number;
}

export interface InProgressSlot extends Slot {
  index: number;
  /**
   * there are half as many of these as there are slots,
   * i.e. both slots/tiles for each pair have the same pairIndex
   */
  hasBeenMatched: boolean;
}

export interface MemoriaPuzzle {
  date: string;
  name: string;
  iconDir: string;
  slots: InProgressSlot[];
}

interface Pair {
  emoji: IconData;
  imageIndex: number;
  textIndex: number;
}

export interface MemoriaMinifiedPuzzle {
  date: string;
  name: string;
  iconDir: string;
  pairs: Pair[];
}
