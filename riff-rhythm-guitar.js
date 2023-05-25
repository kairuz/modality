import * as playerLib from "./player.js";
import * as util from "./util.js";
import {NOTE_LENGTH_SECS} from "./conductor.js";


const STRUM_UP = playerLib.STRUM_DIRECTION_UP;
const STRUM_DOWN = playerLib.STRUM_DIRECTION_DOWN;

const STRUM_PATTERN_01 = [[0, STRUM_DOWN], [1, STRUM_DOWN], [1.75, STRUM_UP], [2.25, STRUM_UP], [2.75, STRUM_DOWN]];
const STRUM_PATTERN_02 = [[0, STRUM_DOWN], [1, STRUM_DOWN], [1.25, STRUM_UP], [2.25, STRUM_UP], [3, STRUM_DOWN], [3.75, STRUM_DOWN]];
const STRUM_PATTERN_03 = [[0, STRUM_DOWN], [0.5, STRUM_DOWN], [0.75, STRUM_UP], [1.25, STRUM_DOWN], [3, STRUM_UP], [3.25, STRUM_DOWN]];
const STRUM_PATTERN_04 = [[0, STRUM_DOWN], [2.25, STRUM_UP], [2.75, STRUM_DOWN]];
const STRUM_PATTERN_05 = [[0, STRUM_DOWN]];
const STRUM_PATTERN_06 = [];

const STRUM_PATTERNS = [
    STRUM_PATTERN_01, STRUM_PATTERN_01, STRUM_PATTERN_01,
    STRUM_PATTERN_02, STRUM_PATTERN_02, STRUM_PATTERN_02,
    STRUM_PATTERN_03, STRUM_PATTERN_03, STRUM_PATTERN_03,
    STRUM_PATTERN_04, STRUM_PATTERN_04,
    STRUM_PATTERN_05,
    STRUM_PATTERN_06
];


export default (composer, player, when, bars) => {
  const presetName = util.randomChoice([playerLib.PRESET_NAME_GUITAR_NYLON, playerLib.PRESET_NAME_GUITAR_STEEL]);
  const volume = {
    [playerLib.PRESET_NAME_GUITAR_NYLON]: 0.4,
    [playerLib.PRESET_NAME_GUITAR_STEEL]: 0.6
  }[presetName];
  const strumPattern = util.randomChoice(STRUM_PATTERNS);
  strumPattern.forEach(([note, strumDirection]) => {
    player.strum(presetName, strumDirection, when + (note * NOTE_LENGTH_SECS), 1, composer.chordOffsets.map((co) => {
      return (composer.octave * 12) + co + composer.chordKeyIndex;
    }), volume);
  });
};
