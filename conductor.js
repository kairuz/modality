import * as domain from "./domain.js";
import * as util from "./util.js";
import * as composerLib from "./composer.js";
import * as glossary from "./glossary.js";


const STANDARD_BEAT_NOTE  = 1/4; // quarter note beats assumed for bpm measurement

const BEATS_PER_MINUTE    = 70; // 1 quarter note = 1 beat;
const NOTES_PER_BAR       = 4;
const NOTE_TYPE           = 1/4;
const BEATS_PER_NOTE      = STANDARD_BEAT_NOTE / NOTE_TYPE;
const BEATS_PER_BAR       = NOTES_PER_BAR * BEATS_PER_NOTE;
const BEAT_LENGTH_MILLIS  = (60000 / BEATS_PER_MINUTE) * (NOTE_TYPE / STANDARD_BEAT_NOTE);
const BEAT_LENGTH_SECS    = BEAT_LENGTH_MILLIS / 1000;
const NOTE_LENGTH_MILLIS  = BEAT_LENGTH_MILLIS * BEATS_PER_NOTE;
const NOTE_LENGTH_SECS    = NOTE_LENGTH_MILLIS / 1000;
const BAR_LENGTH_MILLIS   = NOTE_LENGTH_MILLIS * NOTES_PER_BAR;
const BAR_LENGTH_SECS     = (NOTE_LENGTH_MILLIS * NOTES_PER_BAR) / 1000;


const CHANGE_NONE       = 'none';
const CHANGE_RESET      = 'reset';
const CHANGE_SCALE      = 'scale';
const CHANGE_KEY        = 'key';
const CHANGE_MODE       = 'mode';
const CHANGE_CHORD      = 'chord';
const CHANGE_CHORD_TYPE = 'chordType';
const CHANGES = Object.freeze([CHANGE_NONE, CHANGE_RESET, CHANGE_SCALE, CHANGE_KEY, CHANGE_MODE, CHANGE_CHORD, CHANGE_CHORD_TYPE]);


const CHORD_PROGRESSIONS = Object.freeze([
  Object.freeze([1,4].map((n) => n - 1)),       // C    F
  Object.freeze([1,1,4,4].map((n) => n - 1)),   // C    C    F    F
  Object.freeze([1,4,1,4].map((n) => n - 1)),   // C    F    C    F
  Object.freeze([1,4,5,1].map((n) => n - 1)),   // C    F    G    C
  Object.freeze([1,4,5,4].map((n) => n - 1)),   // C    F    G    F
  Object.freeze([1,4,5,5].map((n) => n - 1)),   // C    F    G    G
  Object.freeze([1,5,6,4].map((n) => n - 1)),   // C    G    Am   F
  Object.freeze([1,6,2,5].map((n) => n - 1)),   // C    Am   Dm   G
  Object.freeze([1,6,4,5].map((n) => n - 1)),   // C    Am   F    G
  Object.freeze([2,5,1,1].map((n) => n - 1)),   // Dm   G    C    C
  Object.freeze([2,5,1,6].map((n) => n - 1)),   // Dm   G    C    Am
  Object.freeze([6,4,1,5].map((n) => n - 1))    // Am   F    C    G
]);


const defaultComposer = composerLib.Composer();
const defaultChangeCallback = (changeType, currentTime, when, bar, composerCapture, composerPrevCapture) => {};

const Conductor = (player, _barRiffs = [], changeCallback = defaultChangeCallback, composer = defaultComposer) => {
  if (!Array.isArray(_barRiffs) || _barRiffs.some((barInstrument) => typeof barInstrument !== 'function')) {
    throw 'invalid barRiffs';
  }
  if (typeof changeCallback !== 'function') {
    throw 'changeCallback must be a function';
  }

  let bars = 0;
  const barRiffs = Object.freeze([..._barRiffs]);
  let running = null;
  let lastBarScheduledFor = null;
  let chordProgressionIndex = null;
  let chordProgressionIndexI = null;

  const queueBar = (when) => {
    if (bars > 0) {
      const composerPrev = composer.capture();

      if (chordProgressionIndex === null && util.randomChance(10)) {
        chordProgressionIndex = util.randomInt(CHORD_PROGRESSIONS.length);
        chordProgressionIndexI = 0;
      }

      const changeType = (() => {
        if (chordProgressionIndex !== null) {
          const chordProgression = CHORD_PROGRESSIONS[chordProgressionIndex];
          const prevChordIndex = composer.chordIndex;
          composer.changeChordIndex(chordProgression[chordProgressionIndexI++]);
          if (chordProgressionIndexI === chordProgression.length) {
            chordProgressionIndex = null;
            chordProgressionIndexI = null;
          }
          return composer.chordIndex !== prevChordIndex ? CHANGE_CHORD : CHANGE_NONE;
        }
        else if (util.randomChance(3)) {
          return CHANGE_NONE;
        }
        else if (util.randomChance(100)) {
          composer.reset();
          return CHANGE_RESET;
        }
        else if (util.randomChance(7)) { // scale
          composer.changeScaleIndex(util.randomInt(composer.scales.length, composer.scaleIndex));
          return CHANGE_SCALE;
        }
        else if (util.randomChance(5)) { // mode
          const isRelative = !util.randomChance(5);

          if (isRelative === true && composer.modeIndex !== 0) {
            const randomModeIndex = util.randomInt(domain.NOTES, composer.modeIndex);
            const chanceOfMode0ElseRandomModeIndex = util.randomChoice([randomModeIndex, randomModeIndex, 0]);
            composer.changeModeIndex(chanceOfMode0ElseRandomModeIndex, isRelative);
          }
          else {
            composer.changeModeIndex(util.randomInt(domain.NOTES, composer.modeIndex), isRelative);
          }

          return CHANGE_MODE;
        }
        else if (util.randomChance(12)) { // key
          composer.changeKeyIndex(util.randomInt(glossary.keyNamesLength, composer.parentKeyIndex));
          return CHANGE_KEY;
        }
        else if (util.randomChance(2)) { // chord
          // todo: how to add exclusion for randomChoice from weighted array?
          if (composerLib.CHORD_COLOR_TONIC_INDEXES.includes(composer.chordIndex)) {
            const changeChordIndex = util.randomChoice(composerLib.CHORD_COLOR_CADENCE_INDEXES_WEIGHTED);
            if (changeChordIndex !== composer.chordIndex) {
              composer.changeChordIndex(changeChordIndex);
            }
            else {
              return CHANGE_NONE;
            }
          }
          else {
            const changeChordIndex = util.randomChoice(composerLib.CHORD_COLOR_TONIC_INDEXES_WEIGHTED);
            if (changeChordIndex !== composer.chordIndex) {
              composer.changeChordIndex(changeChordIndex);
            }
            else {
              return CHANGE_NONE;
            }
          }
          return CHANGE_CHORD;
        }
        else if (util.randomChance(2)) { // chord type
          composer.changeChordType(composer.chordType === domain.CHORD_TYPE_TETRAD ? domain.CHORD_TYPE_TRIAD : domain.CHORD_TYPE_TETRAD);
          return CHANGE_CHORD_TYPE;
        }
        else {
          return CHANGE_NONE;
        }
      })();

      changeCallback(changeType, player.currentTime, when, bars, composer.capture(), composerPrev);
    }

    barRiffs.forEach((barRiff) => barRiff(composer, player, when, bars));

  };

  const scheduleBar = () => {
    lastBarScheduledFor += BAR_LENGTH_SECS;
    queueBar(lastBarScheduledFor);
    bars++;
  };

  const checkScheduleBar = () => {
    return (player.currentTime + 1) > (lastBarScheduledFor + BAR_LENGTH_SECS);
  };

  const checkScheduleBarLoop = () => {
    if (running === true) {
      if (checkScheduleBar()) {
        scheduleBar();
      }
      setTimeout(checkScheduleBarLoop, 100);
    }
    else {
      // stopped
    }
  };

  const start = () => {
    composer.reset();
    bars = 0;
    running = null;
    lastBarScheduledFor = null;
    chordProgressionIndex = null;
    chordProgressionIndexI = null;

    running = true;
    lastBarScheduledFor = player.currentTime - BAR_LENGTH_SECS;
    scheduleBar();
    setTimeout(checkScheduleBarLoop);
  };

  const stop = () => {
    running = false;
    player.stop();
  };

  return Object.freeze({
    get changeCallback(){return changeCallback;},
    get bars(){return bars},
    get composer(){return composer;},
    get player(){return player;},
    get running(){return running;},
    get lastBarScheduledFor(){return lastBarScheduledFor;},
    get chordProgressionIndex(){return chordProgressionIndex;},
    get chordProgressionIndexI(){return chordProgressionIndexI;},
    get barRiffs(){return barRiffs;},
    start,
    stop
  });
};


export {
  STANDARD_BEAT_NOTE, BEATS_PER_MINUTE, NOTES_PER_BAR, NOTE_TYPE, BEATS_PER_NOTE, BEATS_PER_BAR,
  BEAT_LENGTH_MILLIS, BEAT_LENGTH_SECS, NOTE_LENGTH_MILLIS, NOTE_LENGTH_SECS, BAR_LENGTH_MILLIS, BAR_LENGTH_SECS,
  CHORD_PROGRESSIONS,
  CHANGES, CHANGE_NONE, CHANGE_RESET, CHANGE_SCALE, CHANGE_KEY, CHANGE_MODE, CHANGE_CHORD, CHANGE_CHORD_TYPE,
  Conductor, defaultComposer, defaultChangeCallback
};
