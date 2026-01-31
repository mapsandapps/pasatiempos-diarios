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
  onClick?: (slotData: InProgressSlot) => void;
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
    onClick,
  } = props;
  const filePath = getFullPathForIcon(props.iconDir, slotData.emoji.filename);
  const spanishWord = getSpanishWord(
    hasArgentinianBias || false,
    slotData.emoji,
  );

  return (
    <div
      className={clsx(
        "emoji-tile-container",
        !isActive && !slotData.hasBeenMatched && "clickable",
      )}
      key={slotData.emoji.filename}
      onClick={() => (onClick ? onClick(slotData) : {})}
    >
      {/* back of card */}
      <div
        key={`${slotData.emoji.filename}-back`}
        className={clsx(
          "emoji-tile back clickable animate__animated",
          isActive ? "animate__flipOutY" : "animate__flipInY",
          slotData.hasBeenMatched && "hidden",
        )}
      >
        <div className="inside" />
      </div>
      {/* front of card */}
      <div
        key={`${slotData.emoji.filename}-front`}
        className={clsx(
          "front",
          className,
          slotData.isImage ? "image-tile" : "text-tile",
          "emoji-tile animate__animated",
          slotData.hasBeenMatched && "matched",
          isSmall && "small-tile",
          // isActive ? "animate__flipInY" : "animate__flipOutY",
          !isActive && !slotData.hasBeenMatched && "hidden",
          isActive && !slotData.hasBeenMatched && "animate__flipInY",
        )}
      >
        <img
          src={filePath}
          className={clsx(
            !slotData.isImage && "hidden",
            !slotData.isImage &&
              slotData.hasBeenMatched &&
              "animate__animated animate__fadeIn",
          )}
        />
        {slotData.isImage && isInColorblindMode && !slotData.hasBeenMatched && (
          <span className="colorblind-hint">
            {getEnglishNameOfColor(spanishWord)}
          </span>
        )}
        <span
          className={clsx(
            "spanish-word",
            slotData.isImage && !slotData.hasBeenMatched && "hidden",
            slotData.hasBeenMatched && "matched",
          )}
        >
          {spanishWord}
        </span>
      </div>
    </div>
  );
}
