import {STRUM_DIRECTION_UP, STRUM_DIRECTION_DOWN,
  PRESET_NAME_GUITAR_NYLON, PRESET_NAME_GUITAR_STEEL} from "./player.js";
import {randomChoice} from "./util.js";
import {NOTE_LENGTH_SECS} from "./conductor.js";


const U = STRUM_DIRECTION_UP;
const D = STRUM_DIRECTION_DOWN;

const STRUM_PATTERN_01 = [[0, D], [1, D], [1.75, U], [2.25, U], [2.75, D]];
const STRUM_PATTERN_02 = [[0, D], [1, D], [1.25, U], [2.25, U], [3, D], [3.75, D]];
const STRUM_PATTERN_03 = [[0, D], [0.5, D], [0.75, U], [1.25, D], [3, U], [3.25, D]];
const STRUM_PATTERN_04 = [[0, D], [2.25, U], [2.75, D]];
const STRUM_PATTERN_05 = [[0, D]];
const STRUM_PATTERN_06 = [];

const VOLUMES = {
  [PRESET_NAME_GUITAR_NYLON]: 0.4,
  [PRESET_NAME_GUITAR_STEEL]: 0.6
};

const STRUM_PATTERNS_WEIGHTED = [
    STRUM_PATTERN_01, STRUM_PATTERN_01, STRUM_PATTERN_01,
    STRUM_PATTERN_02, STRUM_PATTERN_02, STRUM_PATTERN_02,
    STRUM_PATTERN_03, STRUM_PATTERN_03, STRUM_PATTERN_03,
    STRUM_PATTERN_04, STRUM_PATTERN_04,
    STRUM_PATTERN_05,
    STRUM_PATTERN_06
];


export default (composer, player, when, bars) => {
  const presetName = randomChoice([PRESET_NAME_GUITAR_NYLON, PRESET_NAME_GUITAR_STEEL]);
  const volume = VOLUMES[presetName];
  const strumPattern = randomChoice(STRUM_PATTERNS_WEIGHTED);
  strumPattern.forEach(([note, strumDirection]) => {
    player.strum(presetName, strumDirection, when + (note * NOTE_LENGTH_SECS), 1, composer.chordOffsets.map((co) => {
      return (composer.octave * 12) + co + composer.chordKeyIndex;
    }), volume);
  });
};
