import {
  PRESET_NAME_DRUMS_CRASH, PRESET_NAME_DRUMS_HIHAT, PRESET_NAME_DRUMS_HIHAT_OPEN,
  PRESET_NAME_DRUMS_SNARE, PRESET_NAME_DRUMS_KICK, PITCHES, Riff} from "./player.js";
import {randomChance} from "./util.js";
import {NOTE_LENGTH_SECS} from "./conductor.js";


// 1      &      2      &      3      &      4      &
const RHYTHM_PRESET_NAME_DRUMS_CRASH = [PRESET_NAME_DRUMS_CRASH,
  [0]
];
const RHYTHM_PRESET_NAME_DRUMS_HIHAT = [PRESET_NAME_DRUMS_HIHAT,
  [0,     0.5,    1,    1.5,   2,     2.5,   3,     3.5]
];
const RHYTHM_PRESET_NAME_DRUMS_HIHAT_OPEN = [PRESET_NAME_DRUMS_HIHAT_OPEN,
  [                            2]
];
const RHYTHM_PRESET_NAME_DRUMS_SNARE = [PRESET_NAME_DRUMS_SNARE,
  [              1,                          3]
];
const RHYTHM_PRESET_NAME_DRUMS_KICK = [PRESET_NAME_DRUMS_KICK,
  [0,                          2]
];

const DRUM_PRESET_NAMES_RHYTHMS = [
  RHYTHM_PRESET_NAME_DRUMS_CRASH, RHYTHM_PRESET_NAME_DRUMS_HIHAT, RHYTHM_PRESET_NAME_DRUMS_HIHAT_OPEN,
  RHYTHM_PRESET_NAME_DRUMS_SNARE, RHYTHM_PRESET_NAME_DRUMS_KICK
];

const VOLUMES = {
  [PRESET_NAME_DRUMS_CRASH]:      0.5,
  [PRESET_NAME_DRUMS_HIHAT]:      0.5,
  [PRESET_NAME_DRUMS_HIHAT_OPEN]: 0.5,
  [PRESET_NAME_DRUMS_SNARE]:      0.5,
  [PRESET_NAME_DRUMS_KICK]:       0.8
};


export default (composer, player, when, bars) => {
  const riff = Riff();

  DRUM_PRESET_NAMES_RHYTHMS.forEach(([presetName, drumRhythm]) => {
    drumRhythm.forEach((note) => {

      switch (presetName) {
        case PRESET_NAME_DRUMS_KICK: {
          if (randomChance(6)) {
            riff.addStrike(presetName, when + (NOTE_LENGTH_SECS / 4) + (note * NOTE_LENGTH_SECS), PITCHES[presetName], 1, VOLUMES[presetName]);
          }
          break;
        }
        case PRESET_NAME_DRUMS_HIHAT: {
          if (randomChance(7)) {
            return;
          }
          if (randomChance(5)) {
            riff.addStrike(presetName, when + (NOTE_LENGTH_SECS / 4) + (note * NOTE_LENGTH_SECS), PITCHES[presetName], 1, VOLUMES[presetName]);
          }
          break;
        }
        case PRESET_NAME_DRUMS_HIHAT_OPEN: {
          if (randomChance(2)) {
            return;
          }
          break;
        }
        case PRESET_NAME_DRUMS_CRASH: {
          if (randomChance(2)) {
            return;
          }
          break;
        }
      }
      riff.addStrike(presetName, when + (note * NOTE_LENGTH_SECS), PITCHES[presetName], 1, VOLUMES[presetName]);
    });
  });

  return riff;
};
