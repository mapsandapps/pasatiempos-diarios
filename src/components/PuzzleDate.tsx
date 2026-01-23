import "./PuzzleDate.scss";
import { isDateInLocalStorage } from "../utils/localstorage";

interface PuzzleDateProps {
  puzzleLocalStorageString: string;
  dailyPuzzleDate?: string;
  queryParamDate?: string;
  isUserGenerated?: boolean;
}

export default function PuzzleDate(props: PuzzleDateProps) {
  const {
    dailyPuzzleDate,
    isUserGenerated,
    queryParamDate,
    puzzleLocalStorageString,
  } = props;

  return (
    <div className="puzzle-date">
      {dailyPuzzleDate && (
        <>
          <div className="date">
            {dailyPuzzleDate}
            {isDateInLocalStorage(puzzleLocalStorageString, dailyPuzzleDate) &&
              " ✅"}
          </div>
        </>
      )}
      {isUserGenerated && <div className="date">User-generated puzzle</div>}
      {queryParamDate && (
        <>
          <div className="date">Archive puzzle from {queryParamDate}</div>
        </>
      )}
    </div>
  );
}
