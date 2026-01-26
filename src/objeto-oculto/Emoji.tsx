import React from "react";
import "./Emoji.scss";
import { ICON_SIZE } from "./generator";
import type { Icon, IconToFind } from "./types";
import { getEnglishNameOfColor } from "./helpers";
import clsx from "clsx";

const ICON_TYPES = ["Icon", "IconToFind"];

type IconType = (typeof ICON_TYPES)[number];

interface EmojiProps {
  className?: string;
  icon: Icon | IconToFind;
  isInColorblindMode: boolean;
  iconType: IconType;
}

export default function Emoji(props: EmojiProps) {
  const { className, icon, iconType, isInColorblindMode } = props;

  const hasBeenFound =
    iconType === "IconToFind" && (icon as IconToFind).hasBeenFound;

  return (
    <React.Fragment>
      <img
        src={icon.filePath}
        className={clsx("game-icon", className)}
        width={`${ICON_SIZE}px`}
        height={`${ICON_SIZE}px`}
        data-spanishword={icon.spanishWord}
        style={{
          left: `${icon.x}px`,
          top: `${icon.y}px`,
          transform: `rotate(${icon.rotation}deg)`,
        }}
      ></img>
      {isInColorblindMode && !hasBeenFound && (
        <span
          className={clsx(
            "english-word",
            icon.spanishWord === "negro" ? "dark-icon" : "light-icon",
          )}
          style={{
            left: `${icon.x}px`,
            top: `${icon.y}px`,
            transform: `rotate(${icon.rotation}deg)`,
          }}
        >
          {getEnglishNameOfColor(icon.spanishWord)}
        </span>
      )}
    </React.Fragment>
  );
}
