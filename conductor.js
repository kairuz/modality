import {NOTES, CHORD_TYPE_TETRAD, CHORD_TYPE_TRIAD} from "./scale.js";
import {randomChance, randomInt, randomChoice, Heap} from "./util.js";
import {Composer, CHORD_COLOR_TONIC_INDEXES,
  CHORD_COLOR_TONIC_INDEXES_WEIGHTED, CHORD_COLOR_CADENCE_INDEXES_WEIGHTED} from "./composer.js";
import {KEY_NAMES} from "./glossary.js";


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


const defaultComposer = Composer();
const defaultChangeCallback = (changeType, currentTime, when, bar, composerCapture, composerPrevCapture) => {};

const Conductor = (player, riffRhythmDrums, _barRiffs = [], changeCallback = defaultChangeCallback, composer = defaultComposer) => {
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

  const sequencer = Sequencer(player);

  const queueBar = (when) => {
    if (bars > 0) {
      const composerPrev = composer.capture();

      if (chordProgressionIndex === null && randomChance(10)) {
        chordProgressionIndex = randomInt(CHORD_PROGRESSIONS.length);
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
        else if (randomChance(3)) {
          return CHANGE_NONE;
        }
        else if (randomChance(100)) {
          composer.reset();
          return CHANGE_RESET;
        }
        else if (randomChance(7)) { // scale
          composer.changeScaleIndex(randomInt(composer.scales.length, composer.scaleIndex));
          return CHANGE_SCALE;
        }
        else if (randomChance(5)) { // mode
          const isRelative = !randomChance(5);

          if (isRelative === true && composer.modeIndex !== 0) {
            const randomModeIndex = randomInt(NOTES, composer.modeIndex);
            const chanceOfMode0ElseRandomModeIndex = randomChoice([randomModeIndex, randomModeIndex, 0]);
            composer.changeModeIndex(chanceOfMode0ElseRandomModeIndex, isRelative);
          }
          else {
            composer.changeModeIndex(randomInt(NOTES, composer.modeIndex), isRelative);
          }

          return CHANGE_MODE;
        }
        else if (randomChance(12)) { // key
          composer.changeKeyIndex(randomInt(KEY_NAMES.length, composer.parentKeyIndex));
          return CHANGE_KEY;
        }
        else if (randomChance(2)) { // chord
          // todo: how to add exclusion for randomChoice from weighted array?
          if (CHORD_COLOR_TONIC_INDEXES.includes(composer.chordIndex)) {
            const changeChordIndex = randomChoice(CHORD_COLOR_CADENCE_INDEXES_WEIGHTED);
            if (changeChordIndex !== composer.chordIndex) {
              composer.changeChordIndex(changeChordIndex);
            }
            else {
              return CHANGE_NONE;
            }
          }
          else {
            const changeChordIndex = randomChoice(CHORD_COLOR_TONIC_INDEXES_WEIGHTED);
            if (changeChordIndex !== composer.chordIndex) {
              composer.changeChordIndex(changeChordIndex);
            }
            else {
              return CHANGE_NONE;
            }
          }
          return CHANGE_CHORD;
        }
        else if (randomChance(2)) { // chord type
          composer.changeChordType(composer.chordType === CHORD_TYPE_TETRAD ? CHORD_TYPE_TRIAD : CHORD_TYPE_TETRAD);
          return CHANGE_CHORD_TYPE;
        }
        else {
          return CHANGE_NONE;
        }
      })();

      changeCallback(changeType, player.currentTime, when, bars, composer.capture(), composerPrev);
    }

    barRiffs.forEach((barRiff) => barRiff(composer, player, when, bars));

    const riff = riffRhythmDrums(composer, player, when, bars);

    for (const play of riff.playsValues()) {
      sequencer.add(play);
    }

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

      setTimeout(checkScheduleBarLoop, BAR_LENGTH_MILLIS / 4);
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
    sequencer.start();
    scheduleBar();
    setTimeout(checkScheduleBarLoop);
  };

  const stop = () => {
    running = false;
    player.stop();
    sequencer.stop();
  };

  return {
    get changeCallback(){return changeCallback;},
    get bars(){return bars},
    get composer(){return composer;},
    get player(){return player;},
    get running(){return running;},
    get lastBarScheduledFor(){return lastBarScheduledFor;},
    get chordProgressionIndex(){return chordProgressionIndex;},
    get chordProgressionIndexI(){return chordProgressionIndexI;},
    get barRiffs(){return barRiffs;},
    get barLengthSecs(){return BAR_LENGTH_SECS;},
    start,
    stop
  };
};


const SEQUENCE_AHEAD_SECS = 0.2;
const SEQUENCE_AHEAD_MILLIS = SEQUENCE_AHEAD_SECS * 1000;

const Sequencer = (player) => {
  const plays = Heap((p1, p2) => p1.when - p2.when);

  let running = null;

  const sequence = () => {
    while (checkSequence()) {
      player._play(plays.pop());
    }
  };

  const checkSequence = () => {
    return plays.isNotEmpty &&
           (player.currentTime + SEQUENCE_AHEAD_SECS) > plays.peek().when;
  };

  const checkSequenceLoop = () => {
    if (running === true) {
      if (checkSequence()) {
        sequence();
      }
      setTimeout(checkSequenceLoop, SEQUENCE_AHEAD_MILLIS / 4);
    }
    else {
      // stopped
    }
  };

  const add = (play) => {
    plays.add(play);
  };

  const start = () => {
    running = true;
    setTimeout(checkSequenceLoop);
  };

  const stop = () => {
    running = false;
    plays.clear();
  };

  return {
    add,
    start,
    stop
  }
};


export {
  STANDARD_BEAT_NOTE, BEATS_PER_MINUTE, NOTES_PER_BAR, NOTE_TYPE, BEATS_PER_NOTE, BEATS_PER_BAR,
  BEAT_LENGTH_MILLIS, BEAT_LENGTH_SECS, NOTE_LENGTH_MILLIS, NOTE_LENGTH_SECS, BAR_LENGTH_MILLIS, BAR_LENGTH_SECS,
  CHORD_PROGRESSIONS,
  CHANGES, CHANGE_NONE, CHANGE_RESET, CHANGE_SCALE, CHANGE_KEY, CHANGE_MODE, CHANGE_CHORD, CHANGE_CHORD_TYPE,
  Conductor, defaultComposer, defaultChangeCallback
};
