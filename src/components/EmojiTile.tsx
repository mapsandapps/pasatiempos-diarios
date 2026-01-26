import type { InProgressSlot } from "../memoria/types";
import { getFullPathForIcon, getSpanishWord } from "../objeto-oculto/helpers";
import "./EmojiTile.scss";
import clsx from "clsx";

interface EmojiTileProps {
  className?: string;
  slotData: InProgressSlot;
  iconDir: string;
  isActive?: boolean;
  onClickBack?: (slotData: InProgressSlot) => void;
  onClickMismatched?: (slotData: InProgressSlot) => void;
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

  const onClickMismatched = (slotData: InProgressSlot) => {
    if (!props.onClickMismatched) return;

    if (slotData.hasBeenMatched) return;

    props.onClickMismatched(slotData);
  };

  // @ts-ignore
  if (!isActive && !slotData.hasBeenMatched) {
    // show back
    return (
      <div
        className="emoji-tile back clickable"
        onClick={() => (props.onClickBack ? props.onClickBack(slotData) : {})}
      >
        <div className="inside" />
      </div>
    );
  }

  if (slotData.hasBeenMatched) {
    return (
      <div
        className={clsx(
          className,
          "emoji-tile image-and-text-tile",
          isSmall && "small-tile",
        )}
      >
        <img src={filePath} />
        <span>{spanishWord}</span>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        className,
        "emoji-tile",
        slotData.isImage ? "image-tile" : "text-tile",
        // !slotData.hasBeenMatched && "clickable",
        isSmall && "small-tile",
        isActive && "active",
      )}
      onClick={() => onClickMismatched(slotData)}
    >
      {slotData.isImage ? <img src={filePath} /> : <span>{spanishWord}</span>}
    </div>
  );
}
