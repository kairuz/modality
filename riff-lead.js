import * as domain from "./domain.js";
import * as playerLib from "./player.js";
import * as util from "./util.js";
import {MIN_INDEX, MAX_INDEX} from "./piano.js"
import {NOTE_LENGTH_SECS, BAR_LENGTH_SECS} from "./conductor.js";


let barsToPlay = 0;
let currPresetName = null;
let currVolume = null;

const defaultQueueCallback = (currPresetName, currentTime, when, whenOffset, duration, pitch, currVolume) => {};

const LeadRiffer = (queueCallback = defaultQueueCallback) => {
  return {
    riff: (composer, player, when, bars) => {

      if (barsToPlay === 0) {
        barsToPlay = util.randomChoice([8, 4, 4, 4, 2, 2, 2, 2, 2, 2]);
        currPresetName = util.randomChoice([
          playerLib.PRESET_NAME_GUITAR_ELECTRIC_JAZZ,  // Less chance for electric guitars as they sound bad for lead
          playerLib.PRESET_NAME_GUITAR_ELECTRIC_OVERDRIVE,
          ...Array(3).fill(playerLib.PRESET_NAME_GUITAR_NYLON),
          ...Array(3).fill(playerLib.PRESET_NAME_GUITAR_STEEL),
          ...Array(12).fill(playerLib.PRESET_NAME_PIANO), // More chance for piano as it sounds best for lead
        ]);
        // override volumes
        currVolume = {
          [playerLib.PRESET_NAME_GUITAR_ELECTRIC_JAZZ]: 0.6,
          [playerLib.PRESET_NAME_GUITAR_ELECTRIC_OVERDRIVE]: 0.4,
          [playerLib.PRESET_NAME_GUITAR_NYLON]: 0.6,
          [playerLib.PRESET_NAME_GUITAR_STEEL]: 0.7,
          [playerLib.PRESET_NAME_PIANO]: 0.5
        }[currPresetName];
      }

      barsToPlay--;

      const durations = [0.3, 0.4, 0.4, 0.5, 0.5, 0.5, 0.6, 0.6, 0.6, 0.7];

      const queueLead = (whenOffset, pitch) => {

        if (pitch < MIN_INDEX || pitch > MAX_INDEX || whenOffset > BAR_LENGTH_SECS) {
          // out of bounds
          return;
        }

        const duration = util.randomChoice(durations);
        player.play(currPresetName, when + whenOffset, duration, pitch, currVolume);
        queueCallback(currPresetName, player.currentTime, when, whenOffset, duration, pitch, currVolume);
      };

      const riffA = () => {
        let accTime = 0;
        const plucks = ((3 * 2) - 2) + ((domain.NOTES * 2) - 2);
        const pluckNoteLengthSecs = BAR_LENGTH_SECS / plucks;

        const isTetrad = composer.chordType === domain.CHORD_TYPE_TETRAD;

        for (let i = isTetrad ? 1 : 0; i < composer.chordOffsets.length; i++) {
          if (util.randomChance(3)) {
            continue;
          }
          queueLead(accTime, composer.chordOffsets[i] + (12 * composer.octave) + composer.chordKeyIndex);
          accTime += pluckNoteLengthSecs;
        }

        for (let i = composer.chordOffsets.length - 2; i > 0; i--) {
          if (util.randomChance(3)) {
            continue;
          }
          queueLead(accTime, composer.chordOffsets[i] + (12 * composer.octave) + composer.chordKeyIndex);
          accTime += pluckNoteLengthSecs;
        }

        for (let i = 0; i < composer.modeOffsets.length; i++) {
          if (util.randomChance(3)) {
            continue;
          }
          queueLead(accTime, composer.modeOffsets[i] + (12 * composer.octave) + composer.chordKeyIndex);
          accTime += pluckNoteLengthSecs;
        }

        for (let i = composer.modeOffsets.length - 2; i >= 0; i--) {
          if (util.randomChance(3)) {
            continue;
          }
          queueLead(accTime, composer.modeOffsets[i] + (12 * composer.octave) + composer.chordKeyIndex);
          accTime += pluckNoteLengthSecs;
        }
      };

      const riffBa = () => {
        let accTime = 0;
        let addOctaves = 0;
        let i = util.randomInt(domain.NOTES);

        while (accTime < (BAR_LENGTH_SECS / 2)) {

          if (i >= domain.NOTES) {
            i = 0;
            addOctaves++;
          }

          queueLead(accTime, composer.modeOffsets[i] + (12 * (composer.octave + addOctaves)) + composer.chordKeyIndex);

          accTime += util.randomChance(2) ? (NOTE_LENGTH_SECS / 3) : NOTE_LENGTH_SECS / 2.5;

          const skipRand = util.randomInt(3);
          if (skipRand === 2) {
            i++;
            i++;
          }
          else if (skipRand === 1) {
            i++;
          }
          i++;
        }

        addOctaves = 2;
        i = util.randomInt(domain.NOTES);

        while (accTime < BAR_LENGTH_SECS) {
          if (i <= -1) {
            i = domain.NOTES - 1;
            addOctaves--;
          }
          queueLead(accTime, composer.modeOffsets[i] + (12 * (composer.octave + addOctaves)) + composer.chordKeyIndex);

          accTime += util.randomChance(2) ? (NOTE_LENGTH_SECS / 3) : NOTE_LENGTH_SECS / 2.5;
          const skipRand = util.randomInt(3);
          if (skipRand === 2) {
            i--;
            i--;
          }
          else if (skipRand === 1) {
            i--;
          }
          i--;
        }
      };

      const riffBb = () => {
        let accTime = 0;
        let addOctaves = 1;
        let max = util.randomInt(composer.modeOffsets.length);
        let i = max;

        while (accTime < (BAR_LENGTH_SECS / 2)) {

          if (i < 0) {
            i = max;
            addOctaves--;
          }

          queueLead(accTime, composer.modeOffsets[i] + (12 * (composer.octave + addOctaves)) + composer.chordKeyIndex);

          accTime += util.randomChance(2) ? (NOTE_LENGTH_SECS / 3) : NOTE_LENGTH_SECS / 2.5;

          const skipRand = util.randomInt(3);
          if (skipRand === 2) {
            i--;
            i--;
          }
          else if (skipRand === 1) {
            i--;
          }
          i--;
        }

        addOctaves = 0;
        max = util.randomInt(domain.NOTES);
        i = 0;

        while (accTime < BAR_LENGTH_SECS) {
          if (i >= max) {
            i = 0;
            addOctaves++;
          }
          queueLead(accTime, composer.modeOffsets[i] + (12 * (composer.octave + addOctaves)) + composer.chordKeyIndex);

          accTime += util.randomChance(2) ? (NOTE_LENGTH_SECS / 3) : NOTE_LENGTH_SECS / 2.5;
          const skipRand = util.randomInt(3);
          if (skipRand === 2) {
            i++;
            i++;
          }
          else if (skipRand === 1) {
            i++;
          }
          i++;
        }
      };

      const riffCa = () => {
        const chordCount = util.randomChoice([1, 2, 2, 2, 2, 3, 3, 4, 4, 4, 5, 5, 6]);
        const pluckNoteLengthSecs = (BAR_LENGTH_SECS / (domain.TETRAD_NOTES * chordCount));

        let accTime = 0;
        for (let i = chordCount; i >= 0; i--) {
          if (util.randomChance(6)) {
            continue;
          }
          const relativeChordOffsets = composer.getRelativeChordOffsets(i);
          relativeChordOffsets.forEach((co) => {
            if (util.randomChance(4)) {
              return;
            }
            queueLead(accTime, co + (12 * composer.octave) + composer.chordKeyIndex);
            accTime += pluckNoteLengthSecs;
          });
        }
      };

      const riffCb = () => {
        const chordCount = util.randomChoice([1, 2, 2, 2, 2, 3, 3, 4, 4, 4, 5, 5, 6]);
        const pluckNoteLengthSecs = (BAR_LENGTH_SECS / (domain.TETRAD_NOTES * chordCount));

        let accTime = 0;
        for (let i = 0; i < chordCount; i++) {
          if (util.randomChance(6)) {
            continue;
          }
          const relativeChordOffsets = composer.getRelativeChordOffsets(i);
          relativeChordOffsets.forEach((co) => {
            if (util.randomChance(4)) {
              return;
            }
            queueLead(accTime, co + (12 * composer.octave) + composer.chordKeyIndex);
            accTime += pluckNoteLengthSecs;
          });
        }
      };

      const riffDa = () => {
        const addOctave = util.randomInt(3);
        const chordCount = util.randomChoice([6, 7]);
        const pluckNoteLengthSecs = BAR_LENGTH_SECS / (chordCount * 4);

        let accTime = 0;
        for (let i = 0; i < chordCount; i++) {
          if (util.randomChance(10)) {
            accTime += pluckNoteLengthSecs * 3;
            continue;
          }
          const relativeChordOffsets = composer.getRelativeChordOffsets(i);
          let randomInt = util.randomInt(3);
          for (let j = 0; j < 3; j++) {
            queueLead(accTime, relativeChordOffsets[util.randomInt(3)] + (12 * (composer.octave + addOctave)) + composer.chordKeyIndex);
            accTime += pluckNoteLengthSecs + util.randomChoice([pluckNoteLengthSecs / 3, 0]);
            randomInt = util.randomInt(3, randomInt);
          }
        }
      };

      const riffDb = () => {
        const addOctave = util.randomInt(3);
        const chordCount = util.randomChoice([6, 7]);
        const pluckNoteLengthSecs = BAR_LENGTH_SECS / (chordCount * 4);

        let accTime = 0;
        for (let i = chordCount - 1; i >= 0; i--) {
          if (util.randomChance(10)) {
            accTime += pluckNoteLengthSecs * 3;
            continue;
          }
          const relativeChordOffsets = composer.getRelativeChordOffsets(i);
          let randomInt = util.randomInt(3);
          for (let j = 0; j < 3; j++) {
            queueLead(accTime, relativeChordOffsets[util.randomInt(3)] + (12 * (composer.octave + addOctave)) + composer.chordKeyIndex);
            accTime += pluckNoteLengthSecs + util.randomChoice([pluckNoteLengthSecs / 3, 0]);
            randomInt = util.randomInt(3, randomInt);
          }
        }
      };

      const riffE = () => {};

      const riff = util.randomChoice([
        ...Array(4).fill(riffA),
        ...Array(4).fill(riffBa),
        ...Array(3).fill(riffBb),
        ...Array(3).fill(riffCa),
        ...Array(3).fill(riffCb),
        ...Array(2).fill(riffDa),
        ...Array(2).fill(riffDb),
        ...Array(2).fill(riffE)
      ]);
      riff();
    }
  }
};

export {
  LeadRiffer, defaultQueueCallback
};
