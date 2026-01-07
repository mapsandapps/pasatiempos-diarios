import { getTodayString } from "./dates";

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

export const isTodayInLocalStorage = (keyName: string): boolean => {
  const data = localStorage.getItem(keyName);
  const date = getTodayString();

  if (!data || !date) return false;
  const parsed: string[] = JSON.parse(data);

  var foundIndex = parsed!.findIndex((d) => {
    return d === date;
  });

  return foundIndex > -1;
};

// export const isDateInLocalStorage = (
//   keyName: string,
//   date: string
// ): boolean => {
//   const data = localStorage.getItem(keyName);

//   if (!data || !date) return false;
//   const parsed: string[] = JSON.parse(data);

//   var foundIndex = parsed!.findIndex((d) => {
//     return d === date;
//   });

//   return foundIndex > -1;
// };
