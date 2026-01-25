import { getFullPathForIcon, getSpanishWord } from "../objeto-oculto/helpers";
import type { IconData } from "../objeto-oculto/types";
import "./EmojiTile.scss";
import clsx from "clsx";

interface EmojiTileProps {
  icon: IconData;
  iconDir: string;
  isImage?: boolean;
  hasArgentinianBias?: boolean;
  isInColorblindMode?: boolean;
  isSmall?: boolean;
}

export default function EmojiTile(props: EmojiTileProps) {
  const { hasArgentinianBias, icon, isImage, isInColorblindMode, isSmall } =
    props;
  const filePath = getFullPathForIcon(props.iconDir, props.icon.filename);
  const spanishWord = getSpanishWord(hasArgentinianBias || false, icon);

  console.log(isInColorblindMode); // TODO: use

  return (
    <div
      className={clsx(
        "emoji-tile",
        isImage ? "image-tile" : "text-tile",
        isSmall && "small-tile",
      )}
    >
      {isImage ? <img src={filePath} /> : <span>{spanishWord}</span>}
    </div>
  );
}
