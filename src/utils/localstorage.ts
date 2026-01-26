import { getTodayString } from "./dates";

const defaultToTrue = ["hasArgentinianBias"];

export const addSettingToLocalStorage = (keyName: string, setting: any) => {
  // prefersColorblindMode: stringified boolean
  // hasArgentinianBias: stringified boolean (NOTE: not relevant to Objeto Oculto—its puzzle generation doesn't use this)

  localStorage.setItem(keyName, JSON.stringify(setting));
};

// this returns the stringified object, or null
export const getSettingFromLocalStorage = (keyName: string): string | null => {
  const localStorageSetting = localStorage.getItem(keyName);

  if (!localStorageSetting && defaultToTrue.includes(keyName)) return "true";

  return localStorageSetting;
};

export const addDateToLocalStorage = (keyName: string, date: string) => {
  const existingData = localStorage.getItem(keyName);

  if (!existingData) {
    localStorage.setItem(keyName, JSON.stringify([date]));
    return;
  }

  const parsed: string[] = JSON.parse(existingData);

  var foundIndex = parsed!.findIndex((d) => {
    return d === date;
  });

  if (foundIndex < 0) {
    parsed.push(date);
    localStorage.setItem(keyName, JSON.stringify(parsed));
  } else {
    console.warn("date already in array");
  }
};

/** NOTE:
 * be careful not to use this when a puzzle is displayed; instead use `isDateInLocalStorage` with the date of the puzzle
 * this is good to use for e.g. a summary page
 */
export const isTodayInLocalStorage = (keyName: string): boolean => {
  const date = getTodayString();

  return isDateInLocalStorage(keyName, date);
};

export const isDateInLocalStorage = (
  keyName: string,
  date: string,
): boolean => {
  const data = localStorage.getItem(keyName);

  if (!data || !date) return false;
  const parsed: string[] = JSON.parse(data);

  var foundIndex = parsed!.findIndex((d) => {
    return d === date;
  });

  return foundIndex > -1;
};
