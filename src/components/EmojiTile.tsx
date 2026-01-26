import type { InProgressSlot } from "../memoria/types";
import { getFullPathForIcon, getSpanishWord } from "../objeto-oculto/helpers";
import "./EmojiTile.scss";
import clsx from "clsx";

interface EmojiTileProps {
  className?: string;
  slotData: InProgressSlot;
  iconDir: string;
  isActive?: boolean;
  onClickTile?: (slotData: InProgressSlot) => void;
  hasArgentinianBias?: boolean;
  isInColorblindMode?: boolean;
  isSmall?: boolean;
}

export default function EmojiTile(props: EmojiTileProps) {
  const {
    className,
    slotData,
    isActive,
    hasArgentinianBias,
    // @ts-ignore
    isInColorblindMode,
    isSmall,
  } = props;
  const filePath = getFullPathForIcon(props.iconDir, slotData.emoji.filename);
  const spanishWord = getSpanishWord(
    hasArgentinianBias || false,
    slotData.emoji,
  );

  // @ts-ignore
  if (!isActive && !slotData.hasBeenMatched) {
    // show back
    return (
      <div
        className="emoji-tile back"
        onClick={() =>
          props.onClickTile ? props.onClickTile(slotData as InProgressSlot) : {}
        }
      >
        <div className="inside" />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        className,
        "emoji-tile",
        slotData.isImage ? "image-tile" : "text-tile",
        isSmall && "small-tile",
        isActive && "active",
      )}
    >
      {slotData.isImage ? <img src={filePath} /> : <span>{spanishWord}</span>}
    </div>
  );
}
