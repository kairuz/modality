import {NOTES, CHORD_TYPE_TETRAD, TETRAD_NOTES} from "./scale.js";
import {PRESET_NAME_GUITAR_ELECTRIC_JAZZ, PRESET_NAME_GUITAR_ELECTRIC_OVERDRIVE,
  PRESET_NAME_GUITAR_NYLON, PRESET_NAME_GUITAR_STEEL, PRESET_NAME_PIANO} from "./player.js";
import {randomChoice, randomChance, randomInt} from "./util.js";
import {MIN_INDEX, MAX_INDEX} from "./piano.js"
import {NOTE_LENGTH_SECS, BAR_LENGTH_SECS} from "./conductor.js";


const PRESET_NAMES_WEIGHTED = [
  PRESET_NAME_GUITAR_ELECTRIC_JAZZ,  // Less chance for electric guitars as they sound bad for lead
  PRESET_NAME_GUITAR_ELECTRIC_OVERDRIVE,
  ...Array(3).fill(PRESET_NAME_GUITAR_NYLON),
  ...Array(3).fill(PRESET_NAME_GUITAR_STEEL),
  ...Array(12).fill(PRESET_NAME_PIANO), // More chance for piano as it sounds best for lead
];

const VOLUMES = {
  [PRESET_NAME_GUITAR_ELECTRIC_JAZZ]: 0.5,
  [PRESET_NAME_GUITAR_ELECTRIC_OVERDRIVE]: 0.4,
  [PRESET_NAME_GUITAR_NYLON]: 0.5,
  [PRESET_NAME_GUITAR_STEEL]: 0.6,
  [PRESET_NAME_PIANO]: 0.4
};

let barsToPlay = 0;
let currPresetName = null;
let currVolume = null;

const defaultQueueCallback = (currPresetName, currentTime, when, whenOffset, duration, pitch, currVolume) => {};

const LeadRiffer = (queueCallback = defaultQueueCallback) => {
  return {
    riff: (composer, player, when, bars) => {

      if (barsToPlay === 0) {
        barsToPlay = randomChoice([4, 4, 2, 2, 2]);
        currPresetName = randomChoice(PRESET_NAMES_WEIGHTED);
        currVolume = VOLUMES[currPresetName];
      }

      barsToPlay--;

      const durations = [0.3, 0.4, 0.4, 0.5, 0.5, 0.5, 0.6, 0.6, 0.6, 0.7];

      const queueLead = (whenOffset, pitch, durationOverride = null, volumeOverride = null) => {

        if (pitch < MIN_INDEX || pitch > MAX_INDEX || whenOffset > BAR_LENGTH_SECS) {
          // out of bounds
          return;
        }

        const duration = durationOverride === null ? randomChoice(durations) : durationOverride;

        const volume = volumeOverride !== null ? volumeOverride : currVolume;
        player.play(currPresetName, when + whenOffset, duration, pitch, volume);
        queueCallback(currPresetName, player.currentTime, when, whenOffset, duration, pitch, volume);
      };

      const riffA = () => {
        let accTime = 0;
        const plucks = ((3 * 2) - 2) + ((NOTES * 2) - 2);
        const pluckNoteLengthSecs = BAR_LENGTH_SECS / plucks;

        const isTetrad = composer.chordType === CHORD_TYPE_TETRAD;

        for (let i = isTetrad ? 1 : 0; i < composer.chordOffsets.length; i++) {
          if (randomChance(3)) {
            continue;
          }
          queueLead(accTime, composer.chordOffsets[i] + (12 * composer.octave) + composer.chordKeyIndex);
          accTime += pluckNoteLengthSecs;
        }

        for (let i = composer.chordOffsets.length - 2; i > 0; i--) {
          if (randomChance(3)) {
            continue;
          }
          queueLead(accTime, composer.chordOffsets[i] + (12 * composer.octave) + composer.chordKeyIndex);
          accTime += pluckNoteLengthSecs;
        }

        for (let i = 0; i < composer.modeOffsets.length; i++) {
          if (randomChance(3)) {
            continue;
          }
          queueLead(accTime, composer.modeOffsets[i] + (12 * composer.octave) + composer.chordKeyIndex);
          accTime += pluckNoteLengthSecs;
        }

        for (let i = composer.modeOffsets.length - 2; i >= 0; i--) {
          if (randomChance(3)) {
            continue;
          }
          queueLead(accTime, composer.modeOffsets[i] + (12 * composer.octave) + composer.chordKeyIndex);
          accTime += pluckNoteLengthSecs;
        }
      };

      const riffBa = () => {
        let accTime = 0;
        let addOctaves = 0;
        let i = randomInt(NOTES);

        while (accTime < (BAR_LENGTH_SECS / 2)) {

          if (i >= NOTES) {
            i = 0;
            addOctaves++;
          }

          queueLead(accTime, composer.modeOffsets[i] + (12 * (composer.octave + addOctaves)) + composer.chordKeyIndex);

          accTime += randomChance(2) ? (NOTE_LENGTH_SECS / 3) : NOTE_LENGTH_SECS / 2.5;

          const skipRand = randomInt(3);
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
        i = randomInt(NOTES);

        while (accTime < BAR_LENGTH_SECS) {
          if (i <= -1) {
            i = NOTES - 1;
            addOctaves--;
          }
          queueLead(accTime, composer.modeOffsets[i] + (12 * (composer.octave + addOctaves)) + composer.chordKeyIndex);

          accTime += randomChance(2) ? (NOTE_LENGTH_SECS / 3) : NOTE_LENGTH_SECS / 2.5;
          const skipRand = randomInt(3);
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
        let max = randomInt(composer.modeOffsets.length);
        let i = max;

        while (accTime < (BAR_LENGTH_SECS / 2)) {

          if (i < 0) {
            i = max;
            addOctaves--;
          }

          queueLead(accTime, composer.modeOffsets[i] + (12 * (composer.octave + addOctaves)) + composer.chordKeyIndex);

          accTime += randomChance(2) ? (NOTE_LENGTH_SECS / 3) : NOTE_LENGTH_SECS / 2.5;

          const skipRand = randomInt(3);
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
        max = randomInt(NOTES);
        i = 0;

        while (accTime < BAR_LENGTH_SECS) {
          if (i >= max) {
            i = 0;
            addOctaves++;
          }
          queueLead(accTime, composer.modeOffsets[i] + (12 * (composer.octave + addOctaves)) + composer.chordKeyIndex);

          accTime += randomChance(2) ? (NOTE_LENGTH_SECS / 3) : NOTE_LENGTH_SECS / 2.5;
          const skipRand = randomInt(3);
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
        const chordCount = randomChoice([1, 2, 2, 2, 2, 3, 3, 4, 4, 4, 5, 5, 6]);
        const pluckNoteLengthSecs = (BAR_LENGTH_SECS / (TETRAD_NOTES * chordCount));

        let accTime = 0;
        for (let i = chordCount; i >= 0; i--) {
          if (randomChance(6)) {
            continue;
          }
          const relativeChordOffsets = composer.getRelativeChordOffsets(i);
          relativeChordOffsets.forEach((co) => {
            if (randomChance(4)) {
              return;
            }
            queueLead(accTime, co + (12 * composer.octave) + composer.chordKeyIndex);
            accTime += pluckNoteLengthSecs;
          });
        }
      };

      const riffCb = () => {
        const chordCount = randomChoice([1, 2, 2, 2, 2, 3, 3, 4, 4, 4, 5, 5, 6]);
        const pluckNoteLengthSecs = (BAR_LENGTH_SECS / (TETRAD_NOTES * chordCount));

        let accTime = 0;
        for (let i = 0; i < chordCount; i++) {
          if (randomChance(6)) {
            continue;
          }
          const relativeChordOffsets = composer.getRelativeChordOffsets(i);
          relativeChordOffsets.forEach((co) => {
            if (randomChance(4)) {
              return;
            }
            queueLead(accTime, co + (12 * composer.octave) + composer.chordKeyIndex);
            accTime += pluckNoteLengthSecs;
          });
        }
      };

      const riffDa = () => {
        const addOctave = randomInt(3);
        const chordCount = randomChoice([6, 7]);
        const pluckNoteLengthSecs = BAR_LENGTH_SECS / (chordCount * 4);

        let accTime = 0;
        for (let i = 0; i < chordCount; i++) {
          if (randomChance(10)) {
            accTime += pluckNoteLengthSecs * 3;
            continue;
          }
          const relativeChordOffsets = composer.getRelativeChordOffsets(i);
          let _randomInt = randomInt(3);
          for (let j = 0; j < 3; j++) {
            queueLead(accTime, relativeChordOffsets[randomInt(3)] + (12 * (composer.octave + addOctave)) + composer.chordKeyIndex);
            accTime += pluckNoteLengthSecs + randomChoice([pluckNoteLengthSecs / 3, 0]);
            _randomInt = randomInt(3, _randomInt);
          }
        }
      };

      const riffDb = () => {
        const addOctave = randomInt(3);
        const chordCount = randomChoice([6, 7]);
        const pluckNoteLengthSecs = BAR_LENGTH_SECS / (chordCount * 4);

        let accTime = 0;
        for (let i = chordCount - 1; i >= 0; i--) {
          if (randomChance(10)) {
            accTime += pluckNoteLengthSecs * 3;
            continue;
          }
          const relativeChordOffsets = composer.getRelativeChordOffsets(i);
          let _randomInt = randomInt(3);
          for (let j = 0; j < 3; j++) {
            queueLead(accTime, relativeChordOffsets[randomInt(3)] + (12 * (composer.octave + addOctave)) + composer.chordKeyIndex);
            accTime += pluckNoteLengthSecs + randomChoice([pluckNoteLengthSecs / 3, 0]);
            _randomInt = randomInt(3, _randomInt);
          }
        }
      };

      const riffEa = () => {
        const chordCount = randomChoice([7, 8, 9, 10]);
        const pluckNoteLengthSecs = BAR_LENGTH_SECS / randomChoice([chordCount + randomInt(2), chordCount]);
        const trillGapSecs = pluckNoteLengthSecs / 10;

        let accTime = 0;
        for (let i = 0; i < chordCount; i++) {
          if (randomChance(4)) {
            accTime += randomChance(2) ? pluckNoteLengthSecs : pluckNoteLengthSecs / 2;
            continue;
          }
          const addOctave = randomInt(2);
          const minusOctave = randomInt(2);
          const relativeChordOffsets = composer.getRelativeChordOffsets(i);
          (randomChance(3) ? [...relativeChordOffsets].reverse() : relativeChordOffsets).forEach((co, j) => {
            if (randomChance(3)) {
              return;
            }
            queueLead(
                accTime + (j * trillGapSecs),
                co + (12 * (composer.octave + addOctave - minusOctave)) + composer.chordKeyIndex,
                randomChoice([0.3, 0.5, 0.7]),
                currVolume - 0.2
            );
          });
          if (randomChance(3)) {
            queueLead(
                accTime, relativeChordOffsets[0] + (12 * (composer.octave - 2) + composer.chordKeyIndex), 0.8);
          }
          accTime += pluckNoteLengthSecs;
        }
      };

      const riffEb = () => {
        const chordCount = randomChoice([7, 8, 9, 10]);
        const pluckNoteLengthSecs = BAR_LENGTH_SECS / randomChoice([chordCount + randomInt(2), chordCount]);
        const trillGapSecs = pluckNoteLengthSecs / 10;

        let accTime = 0;
        for (let i = chordCount - 1; i > 0; i--) {
          if (randomChance(4)) {
            accTime += randomChance(2) ? pluckNoteLengthSecs : pluckNoteLengthSecs / 2;
            continue;
          }
          const addOctave = randomInt(2);
          const minusOctave = randomInt(2);
          const relativeChordOffsets = composer.getRelativeChordOffsets(i);
          (randomChance(3) ? [...relativeChordOffsets].reverse() : relativeChordOffsets).forEach((co, j) => {
            if (randomChance(3)) {
              return;
            }
            queueLead(
                accTime + (j * trillGapSecs),
                co + (12 * (composer.octave + addOctave - minusOctave)) + composer.chordKeyIndex,
                randomChoice([0.3, 0.5, 0.7]),
                currVolume - 0.2
            );
          });
          if (randomChance(3)) {
            queueLead(
                accTime, relativeChordOffsets[0] + (12 * (composer.octave - 2) + composer.chordKeyIndex), 0.8);
          }
          accTime += pluckNoteLengthSecs;
        }
      };

      const riffF = () => {};

      const riff = randomChoice([
        ...Array(4).fill(riffA),
        ...Array(4).fill(riffBa),
        ...Array(3).fill(riffBb),
        ...Array(3).fill(riffCa),
        ...Array(3).fill(riffCb),
        ...Array(3).fill(riffDa),
        ...Array(3).fill(riffDb),
        ...Array(2).fill(riffEa),
        ...Array(2).fill(riffEb),
        ...Array(1).fill(riffF)
      ]);
      riff();
    }
  }
};


export {
  LeadRiffer, defaultQueueCallback
};
