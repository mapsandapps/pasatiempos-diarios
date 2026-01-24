import "./PuzzleDate.scss";
import { isDateInLocalStorage } from "../utils/localstorage";
import { format, parse } from "date-fns";

interface PuzzleDateProps {
  puzzleDate?: string;
  isDailyPuzzle: boolean;
  isUserGenerated?: boolean;
  puzzleLocalStorageString: string;
}

export default function PuzzleDate(props: PuzzleDateProps) {
  const {
    puzzleDate,
    isDailyPuzzle,
    isUserGenerated,
    puzzleLocalStorageString,
  } = props;

  const date = format(
    parse(puzzleDate || "2026-01-23", "yyyy-MM-dd", new Date()),
    "PPPP"
  );

  return (
    <div className="puzzle-date">
      {isDailyPuzzle && (
        <>
          <div className="date">
            {date}
            {isDateInLocalStorage(
              puzzleLocalStorageString,
              puzzleDate || "2026-01-23"
            ) && " ✅"}
          </div>
        </>
      )}
      {isUserGenerated && <div className="date">User-generated puzzle</div>}
      {!isUserGenerated && !isDailyPuzzle && (
        <>
          <div className="date">Archive puzzle from {date}</div>
        </>
      )}
    </div>
  );
}
