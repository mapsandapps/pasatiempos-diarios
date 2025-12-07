import "./Game.scss";
import { fill, sampleSize } from "lodash";

interface Definition {
  definition: string;
  syllables: string[];
}

interface RawPuzzle {
  date: string;
  rangeStart: string;
  rangeEnd: string;
  puzzle: string[];
}

interface Puzzle {
  words: Definition[];
  syllables: string[];
}

const puzzles: RawPuzzle[] = [
  {
    date: "2025-12-08",
    rangeStart: "1500",
    rangeEnd: "2500",
    puzzle: [
      "es-pec-tá-cu-lo|Show",
      "os-cu-ri-dad|Darkness",
      "mer-ca-do|Market",
      "ro-sa|Pink",
      "te-so-ro|Treasure",
    ],
  },
  {
    date: "2025-12-09",
    rangeStart: "2000",
    rangeEnd: "3000",
    puzzle: [
      "an-ti-guo|Old",
      "pri-ma-ve-ra|Spring",
      "fuen-te|Source",
      "en-tre-vis-ta|Interview",
      "pen-sa-mien-tos|Thoughts",
    ],
  },
  {
    date: "2025-12-10",
    rangeStart: "3000",
    rangeEnd: "4000",
    puzzle: [
      "ac-tua-ción|Performance",
      "ga-fas|Glasses",
      "a-ma-ri-llo|Yellow",
      "cor-ba-ta|Tie",
      "i-dio-ma|Language",
    ],
  },
  {
    date: "2025-12-11",
    rangeStart: "500",
    rangeEnd: "1000",
    puzzle: [
      "ca-fé|Coffee",
      "úl-ti-mo|Last",
      "pla-cer|Delight",
      "vis-ta|View",
      "li-ber-tad|Freedom",
    ],
  },
  {
    date: "2025-12-12",
    rangeStart: "1000",
    rangeEnd: "1500",
    puzzle: [
      "rei-na|Queen",
      "es-cu-char|Listen",
      "fan-tás-ti-co|Fantastic",
      "com-pa-ñe-ro|Classmate",
      "re-cor-dar|Remember",
    ],
  },
  {
    date: "2025-12-13",
    rangeStart: "0",
    rangeEnd: "1000",
    puzzle: [
      "fal-ta|Absence",
      "di-fí-cil|Difficult",
      "co-ra-zón|Heart",
      "su-pues-to|Supposed",
      "se-gu-ro|Safe",
    ],
  },
  {
    date: "2025-12-14",
    rangeStart: "2500",
    rangeEnd: "3500",
    puzzle: [
      "chis-te|Joke",
      "en-tre-ga|Delivery",
      "len-ta-men-te|Slowly",
      "des-per-tar|Awakening",
      "ver-da-de-ra-men-te|Really",
    ],
  },
];

export default function Game() {
  let activeWordIndex = 0;
  const today = new Date();
  const todayWeekday = today.getDay();
  const todayPuzzle = puzzles.find((puzzle) => {
    // NOTE: this can be off a day from what you'd expect, but this is temporary code anyway
    const puzzleWeekday = new Date(puzzle.date).getDay();
    return puzzleWeekday === todayWeekday;
  });

  if (!todayPuzzle) {
    return (
      <div className="game">
        <div className="error">An error has occurred</div>
      </div>
    );
  }

  const solution: Definition[] = [];

  const inProgressPuzzle: Puzzle = {
    words: [],
    syllables: [],
  };

  todayPuzzle.puzzle.forEach((def) => {
    const [syllables, definition] = def.split("|");
    solution.push({
      definition,
      syllables: syllables.split("-"),
    });
    inProgressPuzzle.words.push({
      definition,
      syllables: fill(Array(syllables.split("-").length), ""),
    });
    inProgressPuzzle.syllables.push(...syllables.split("-"));
  });

  // randomize syllables
  inProgressPuzzle.syllables = sampleSize(
    inProgressPuzzle.syllables,
    inProgressPuzzle.syllables.length
  );

  const onClickWord = (i: number) => {
    console.log(i);
    activeWordIndex = i;
  };

  return (
    <div className="game-container">
      {todayWeekday}, {today.toLocaleDateString()}
      <div className="game">
        {inProgressPuzzle.words.map((word, i) => (
          <div
            className={`word ${i === activeWordIndex ? "active" : ""}`}
            key={i}
            onClick={() => onClickWord(i)}
          >
            <div className="definition">{word.definition}</div>
            {word.syllables.map((syllable, i) => (
              <div
                className={`${
                  syllable === "" ? "empty-syllable" : ""
                } syllable`}
                key={i}
              >
                {syllable}
              </div>
            ))}
          </div>
        ))}
        <div>
          {inProgressPuzzle.syllables.map((syllable, i) => (
            <div className="syllable" key={i}>
              {syllable}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
