import "./PuzzleDate.scss";
import { isDateInLocalStorage } from "../utils/localstorage";
import { format, parse } from "date-fns";

interface PuzzleDateProps {
  puzzleDate?: string;
  isDailyPuzzle: boolean;
  isInGeneratorMode?: boolean;
  puzzleLocalStorageString: string;
}

export default function PuzzleDate(props: PuzzleDateProps) {
  const {
    puzzleDate,
    isDailyPuzzle,
    isInGeneratorMode,
    puzzleLocalStorageString,
  } = props;

  const date = format(
    parse(puzzleDate || "2026-01-23", "yyyy-MM-dd", new Date()),
    "PPPP"
  );

  if (isInGeneratorMode) {
    return;
  }

  if (isDailyPuzzle) {
    return (
      <div className="puzzle-date">
        {date}
        {isDateInLocalStorage(
          puzzleLocalStorageString,
          puzzleDate || "2026-01-23"
        ) && " ✅"}
      </div>
    );
  }

  return <div className="puzzle-date">Archive puzzle from {date}</div>;
}
