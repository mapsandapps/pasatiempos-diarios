const falseDiphthongs = ["ía", "ea", "eo"];
const prefixes = ["in", "en"];

const isConsonant = (letter?: string) => {
  if (!letter) return false;

  return !/[aeiouáéíóú]/i.test(letter);
};

// Source of initial regex - https://stackoverflow.com/a/49407494
// Posted by Anders, modified by community. See post 'Timeline' for change history
// Retrieved 2025-12-08, License - CC BY-SA 3.0

const syllableRegex =
  /[^aeiouáéíóú]*[aeiouáéíóú]+(?:[^aeiouáéíóú]*$|[^aeiouáéíóú](?=[^aeiouáéíóú]))?/gi;
// /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi;

const syllabify = (word: string): any => {
  return word.match(syllableRegex);
};

/** take the ith syllable and the one before it,
 * remove the last character of the "first" syllable (i - 1)
 * prepend the second syllable (i) with that character */
const recombine = (allSyllables: string[], i: number): string[] => {
  if (i < 1) return allSyllables;

  var firstSyllable = allSyllables[i - 1];
  var secondSyllable = allSyllables[i];

  // get character
  const lastCharacterOfFirstSyllable = firstSyllable.slice(-1);

  // remove character from first syllable
  firstSyllable = firstSyllable.slice(0, -1);

  // move it to the beginning of the second syllable
  secondSyllable = lastCharacterOfFirstSyllable + secondSyllable;

  const newSyllables = [...allSyllables];
  newSyllables[i - 1] = firstSyllable;
  newSyllables[i] = secondSyllable;

  return newSyllables;
};

/**
 * Look for consonant pairs that are getting broken that shouldn't
 * e.g. "ll", "bl", "tr"
 */
const fixConsonants = (syllables: string[]): string[] => {
  syllables.forEach((syllable, i) => {
    if (i === 0) return;

    // any "l" or "r" preceeded by a consonant
    if (syllable.at(0) === "l" || syllable.at(0) === "r") {
      if (isConsonant(syllables[i - 1].at(-1))) {
        // move consonant from end of first syllable to beginning of second
        syllables = recombine(syllables, i);
      }
    }

    // "ch"
    if (syllable.at(0) === "h" && syllables[i - 1].at(-1) === "c") {
      syllables = recombine(syllables, i);
    }
  });

  return syllables;
};

const splitFalseDiphthong = (
  allSyllables: string[],
  i: number,
  str: string,
): string[] => {
  const syllable = allSyllables[i];
  const iToSplit = syllable.indexOf(str[0]) + 1;
  const firstHalf = syllable.slice(0, iToSplit);
  const secondHalf = syllable.substring(iToSplit);

  allSyllables.splice(i, 1, firstHalf);
  allSyllables.splice(i + 1, 0, secondHalf);
  return allSyllables;
};

const splitFalseDiphthongs = (syllables: string[]): string[] => {
  falseDiphthongs.forEach((str) => {
    syllables.forEach((syllable, i) => {
      if (syllable.includes(str)) {
        syllables = splitFalseDiphthong(syllables, i, str);
      }
    });
  });

  return syllables;
};

const doNotSplitPrefix = (syllables: string[]): string[] => {
  // add first character of second syllable to first syllable
  syllables[0] = syllables[0] + syllables[1].at(0);

  // remove first character from second syllable
  syllables[1] = syllables[1].slice(1);

  return syllables;
};

const checkForPrefix = (spanishWord: string, syllables: string[]): string[] => {
  if (
    prefixes.includes(spanishWord.slice(0, 2)) &&
    !prefixes.includes(syllables[0])
  ) {
    syllables = doNotSplitPrefix(syllables);
  }

  return syllables;
};

const adjustSyllables = (
  spanishWord: string,
  syllables: string[],
): string[] => {
  syllables = fixConsonants(syllables);

  syllables = splitFalseDiphthongs(syllables);

  // NOTE: this needs to run after fixConsonants, otherwise e.g. "enlazar" will get split between "n" and "l"
  syllables = checkForPrefix(spanishWord, syllables);

  return syllables;
};

export const getSyllables = (spanishWord: string): string[] => {
  const syllables = syllabify(spanishWord);

  var adjustedSyllables = adjustSyllables(spanishWord, syllables);

  return adjustedSyllables;
};
