import * as playerLib from "./player.js";
import * as util from "./util.js";
import {NOTE_LENGTH_SECS} from "./conductor.js";


// 1      &      2      &      3      &      4      &
const RHYTHM_PRESET_NAME_DRUMS_CRASH = [playerLib.PRESET_NAME_DRUMS_CRASH,
  [0]
];
const RHYTHM_PRESET_NAME_DRUMS_HIHAT = [playerLib.PRESET_NAME_DRUMS_HIHAT,
  [0,     0.5,    1,    1.5,   2,     2.5,   3,     3.5]
];
const RHYTHM_PRESET_NAME_DRUMS_HIHAT_OPEN = [playerLib.PRESET_NAME_DRUMS_HIHAT_OPEN,
  [                            2]
];
const RHYTHM_PRESET_NAME_DRUMS_SNARE = [playerLib.PRESET_NAME_DRUMS_SNARE,
  [              1,                          3]
];
const RHYTHM_PRESET_NAME_DRUMS_KICK = [playerLib.PRESET_NAME_DRUMS_KICK,
  [0,                          2]
];


const DRUM_PRESET_NAMES_RHYTHMS = [
  RHYTHM_PRESET_NAME_DRUMS_CRASH, RHYTHM_PRESET_NAME_DRUMS_HIHAT, RHYTHM_PRESET_NAME_DRUMS_HIHAT_OPEN,
  RHYTHM_PRESET_NAME_DRUMS_SNARE, RHYTHM_PRESET_NAME_DRUMS_KICK
];


export default (composer, player, when, bars) => {
  DRUM_PRESET_NAMES_RHYTHMS.forEach(([presetName, drumRhythm]) => {
    drumRhythm.forEach((note) => {

      switch (presetName) {
        case playerLib.PRESET_NAME_DRUMS_KICK: {
          if (util.randomChance(7)) {
            player.play(presetName, when + (NOTE_LENGTH_SECS / 4) + (note * NOTE_LENGTH_SECS), 1, undefined, 0.8);
          }
          break;
        }
        case playerLib.PRESET_NAME_DRUMS_HIHAT: {
          if (util.randomChance(5)) {
            player.play(presetName, when + (NOTE_LENGTH_SECS / 4) + (note * NOTE_LENGTH_SECS), 1, undefined, 0.5);
          }
          break;
        }
        case playerLib.PRESET_NAME_DRUMS_HIHAT_OPEN: {
          if (util.randomChance(3)) {
            return;
          }
          break;
        }
        case playerLib.PRESET_NAME_DRUMS_CRASH: {
          if (util.randomChance(3)) {
            return;
          }
          break;
        }
      }
      player.play(presetName, when + (note * NOTE_LENGTH_SECS), 1, undefined, 0.5);
    });
  });
};
