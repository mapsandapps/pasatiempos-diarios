import { capitalizeFirstLetter } from "../utils/helpers";

export const minifyWord = (english: string, syllables: string[]): string => {
  return `${syllables.join("-")}|${capitalizeFirstLetter(english)}`;
};
