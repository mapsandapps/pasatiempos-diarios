import type { IconData } from "../objeto-oculto/types";

export interface Slot {
  emoji: IconData;
  isImage?: boolean;
}

export interface MemoriaPuzzle {
  name: string;
  iconDir: string;
  slots: Slot[];
}
