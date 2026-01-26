import type { InProgressSlot } from "../memoria/types";
import {
  getEnglishNameOfColor,
  getFullPathForIcon,
  getSpanishWord,
} from "../objeto-oculto/helpers";
import "./EmojiTile.scss";
import "animate.css";
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

  // back of card
  if (!isActive && !slotData.hasBeenMatched) {
    return (
      <div
        key={`${slotData.emoji.filename}-back`}
        className="emoji-tile back clickable animate__animated animate__flipInY"
        onClick={() => (props.onClickBack ? props.onClickBack(slotData) : {})}
      >
        <div className="inside" />
      </div>
    );
  }

  // front of card that has been matched
  if (slotData.hasBeenMatched) {
    return (
      <div
        key={`${slotData.emoji.filename}-matched`}
        className={clsx(
          className,
          "emoji-tile image-and-text-tile animate__animated animate__pulse",
          isSmall && "small-tile",
        )}
      >
        <img src={filePath} />
        <span>{spanishWord}</span>
      </div>
    );
  }

  // front of card that has not been matched
  return (
    <div
      key={`${slotData.emoji.filename}-front`}
      className={clsx(
        className,
        "emoji-tile animate__animated",
        slotData.isImage ? "image-tile" : "text-tile",
        isSmall && "small-tile",
        isActive && "animate__flipInY",
      )}
      onClick={() => onClickMismatched(slotData)}
    >
      {slotData.isImage ? (
        <>
          <img src={filePath} />
          {isInColorblindMode && (
            <span className="colorblind-hint">
              {getEnglishNameOfColor(spanishWord)}
            </span>
          )}
        </>
      ) : (
        <span>{spanishWord}</span>
      )}
    </div>
  );
}
