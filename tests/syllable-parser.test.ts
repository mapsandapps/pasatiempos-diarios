import { expect, test } from "vitest";
import { getSyllables } from "../src/utils/syllable-parser";

const testCases = [
  { word: "estrella", correctSyllables: ["es", "tre", "lla"] }, // "ll" should not split
  { word: "librería", correctSyllables: ["li", "bre", "rí", "a"] }, // "br" should not split; "ía" should split
  { word: "inalcanzable", correctSyllables: ["in", "al", "can", "za", "ble"] }, // "in" should not split at beginning of word
  { word: "correr", correctSyllables: ["co", "rrer"] }, // "rr" should not split
  { word: "triple", correctSyllables: ["tri", "ple"] }, // "pl" should not split
  { word: "bibliografía", correctSyllables: ["bi", "blio", "gra", "fí", "a"] }, // "bl should not split"; "gr" should not split; "ía" should split
  { word: "voltear", correctSyllables: ["vol", "te", "ar"] }, // "ea" should split
  { word: "veintitrés", correctSyllables: ["vein", "ti", "trés"] }, // "tr" should not split
  { word: "enlazar", correctSyllables: ["en", "la", "zar"] }, // "en" should not split at beginning of word; in this case, "nl" SHOULD split
  { word: "núcleo", correctSyllables: ["nú", "cle", "o"] }, // "eo" should split
  { word: "noche", correctSyllables: ["no", "che"] }, // should not split before "h"
  { word: "alhajas", correctSyllables: ["al", "ha", "jas"] }, // should split before "h"
  { word: "influir", correctSyllables: ["in", "fluir"] }, // "in" should not split; "fl" should not split
  // TODO: not yet fixed:
  // { word: "retransmisión", correctSyllables: ["re-trans-mi-sión"] }, // "trans" should be together
];

testCases.forEach(({ word, correctSyllables }) => {
  test(`makes correct syllables from word: ${word}`, () => {
    expect(getSyllables(word)).toEqual(correctSyllables);
  });
});
