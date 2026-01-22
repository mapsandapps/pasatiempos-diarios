export const getSyllables = (spanishWord: string): string[] => {
  // Source - https://stackoverflow.com/a/49407494
  // Posted by Anders, modified by community. See post 'Timeline' for change history
  // Retrieved 2025-12-08, License - CC BY-SA 3.0

  const syllableRegex =
    /[^aeiouáéíóú]*[aeiouáéíóú]+(?:[^aeiouáéíóú]*$|[^aeiouáéíóú](?=[^aeiouáéíóú]))?/gi;
  // /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi;

  const syllabify = (word: string): any => {
    return word.match(syllableRegex);
  };

  return syllabify(spanishWord);
};
