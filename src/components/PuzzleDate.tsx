import "./PuzzleDate.scss";
import { isDateInLocalStorage } from "../utils/localstorage";
import { format, parse } from "date-fns";

interface PuzzleDateProps {
  puzzleLocalStorageString: string;
  dailyPuzzleDate?: string;
  queryParamDate?: string;
  isUserGenerated?: boolean;
}

export default function PuzzleDate(props: PuzzleDateProps) {
  const {
    dailyPuzzleDate,
    queryParamDate,
    isUserGenerated,
    puzzleLocalStorageString,
  } = props;

  // const date = new Date(
  //   dailyPuzzleDate || queryParamDate || "2026-01-23"
  // ).toLocaleDateString(undefined, {
  //   weekday: "long",
  //   month: "long",
  //   day: "numeric",
  // });

  const date = format(
    parse(
      dailyPuzzleDate || queryParamDate || "2026-01-23",
      "yyyy-MM-dd",
      new Date()
    ),
    "PPPP"
  );

  console.log({
    dailyPuzzleDate,
    isUserGenerated,
    queryParamDate,
    puzzleLocalStorageString,
  });

  return (
    <div className="puzzle-date">
      {dailyPuzzleDate && (
        <>
          <div className="date">
            {date}
            {isDateInLocalStorage(puzzleLocalStorageString, dailyPuzzleDate) &&
              " ✅"}
          </div>
        </>
      )}
      {isUserGenerated && <div className="date">User-generated puzzle</div>}
      {queryParamDate && (
        <>
          <div className="date">Archive puzzle from {date}</div>
        </>
      )}
    </div>
  );
}
