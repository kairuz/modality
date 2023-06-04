import {cyclicIndex} from "./util.js";
import {Scale} from "./scale.js";


const KEY_C   = 'C';
const KEY_Cs  = 'C#';
const KEY_Db  = 'Db';
const KEY_D   = 'D';
const KEY_Ds  = 'D#';
const KEY_Eb  = 'Eb';
const KEY_E   = 'E';
const KEY_F   = 'F';
const KEY_Fs  = 'F#';
const KEY_Gb  = 'Gb';
const KEY_G   = 'G';
const KEY_Gs  = 'G#';
const KEY_Ab  = 'Ab';
const KEY_A   = 'A';
const KEY_As  = 'A#';
const KEY_Bb  = 'Bb';
const KEY_B   = 'B';

const KEYS = Object.freeze([KEY_C, KEY_Cs, KEY_Db, KEY_D, KEY_Ds, KEY_Eb, KEY_E, KEY_F, KEY_Fs,
                            KEY_Gb, KEY_G, KEY_Gs, KEY_Ab, KEY_A, KEY_As, KEY_Bb, KEY_B]);

const KEY_NAMES = Object.freeze([
  KEY_C,
  `${KEY_Cs}/${KEY_Db}`,
  KEY_D,
  `${KEY_Ds}/${KEY_Eb}`,
  KEY_E,
  KEY_F,
  `${KEY_Fs}/${KEY_Gb}`,
  KEY_G,
  `${KEY_Gs}/${KEY_Ab}`,
  KEY_A,
  `${KEY_As}/${KEY_Bb}`,
  KEY_B
]);

const KEY_NAME_INDEX = Object.freeze({
  [KEY_C] : 0,
  [KEY_Cs]: 1,
  [KEY_Db]: 1,
  [KEY_D] : 2,
  [KEY_Ds]: 3,
  [KEY_Eb]: 3,
  [KEY_E] : 4,
  [KEY_F] : 5,
  [KEY_Fs]: 6,
  [KEY_Gb]: 6,
  [KEY_G] : 7,
  [KEY_Gs]: 8,
  [KEY_Ab]: 8,
  [KEY_A] : 9,
  [KEY_As]: 10,
  [KEY_Bb]: 10,
  [KEY_B] : 11
});

const SCALE_PATTERN_MAJOR           = '101011010101';
const SCALE_PATTERN_HARMONIC_MINOR  = '101011001101';
const SCALE_PATTERN_HARMONIC_MAJOR  = '101011011001';
const SCALE_PATTERN_MELODIC_MINOR   = '101101010101';

const SCALE_PATTERNS = Object.freeze([SCALE_PATTERN_MAJOR, SCALE_PATTERN_HARMONIC_MINOR, SCALE_PATTERN_HARMONIC_MAJOR, SCALE_PATTERN_MELODIC_MINOR]);

const SCALE_NAME_MAJOR          = 'Major';
const SCALE_NAME_HARMONIC_MINOR = 'Harmonic Minor';
const SCALE_NAME_HARMONIC_MAJOR = 'Harmonic Major';
const SCALE_NAME_MELODIC_MINOR  = 'Melodic Minor';

const SCALE_NAMES = Object.freeze([SCALE_NAME_MAJOR, SCALE_NAME_HARMONIC_MINOR, SCALE_NAME_HARMONIC_MAJOR, SCALE_NAME_MELODIC_MINOR]);

const SCALE_MAJOR           = Scale(SCALE_PATTERN_MAJOR);
const SCALE_HARMONIC_MINOR  = Scale(SCALE_PATTERN_HARMONIC_MINOR);
const SCALE_HARMONIC_MAJOR  = Scale(SCALE_PATTERN_HARMONIC_MAJOR);
const SCALE_MELODIC_MINOR   = Scale(SCALE_PATTERN_MELODIC_MINOR);

const SCALES = Object.freeze([SCALE_MAJOR, SCALE_HARMONIC_MINOR, SCALE_HARMONIC_MAJOR, SCALE_MELODIC_MINOR]);

const MODE_NAMES_MAJOR_SCALE = Object.freeze([
    'Ionian',
    'Dorian',
    'Phrygian',
    'Lydian',
    'Mixolydian',
    'Aeolian',
    'Locrian'
]);

const MODE_NAMES_HARMONIC_MINOR_SCALE = Object.freeze([
    'Ionian #5 / Augmented Major',
    'Altered Dorian',
    'Phrygian Dominant',
    'Lydian #2',
    'Super Locrian bb7 / Altered Diminished',
    'Harmonic Minor / Aeolian #7',
    'Locrian #6'
]);

const MODE_NAMES_HARMONIC_MAJOR_SCALE = Object.freeze([
    'Harmonic Major / Ionian b6',
    'Dorian b5 / Locrian #2',
    'Phrygian b4',
    'Lydian b3 / Melodic Minor #4',
    'Mixolydian b2',
    'Lydian Augmented #2',
    'Locrian bb7'
]);

const MODE_NAMES_MELODIC_MINOR_SCALE = Object.freeze([
    'Melodic Minor / Jazz Minor',
    'Dorian b2 / Phrygian #6',
    'Lydian Augmented',
    'Lydian Dominant / Overtone',
    'Mixolydian b6 / Aeolian Dominant',
    'Half-diminished / Aeolian b5',
    'Super Locrian / Altered dominant',
]);

const MODES_NAMES = Object.freeze([
    MODE_NAMES_MAJOR_SCALE,
    MODE_NAMES_HARMONIC_MINOR_SCALE,
    MODE_NAMES_HARMONIC_MAJOR_SCALE,
    MODE_NAMES_MELODIC_MINOR_SCALE
]);

const SCALES_NAMES_MODES_NAMES = Object.freeze([
    Object.freeze([SCALE_MAJOR,           SCALE_NAME_MAJOR,           MODE_NAMES_MAJOR_SCALE]),
    Object.freeze([SCALE_HARMONIC_MINOR,  SCALE_NAME_HARMONIC_MINOR,  MODE_NAMES_HARMONIC_MINOR_SCALE]),
    Object.freeze([SCALE_HARMONIC_MAJOR,  SCALE_NAME_HARMONIC_MAJOR,  MODE_NAMES_HARMONIC_MAJOR_SCALE]),
    Object.freeze([SCALE_MELODIC_MINOR,   SCALE_NAME_MELODIC_MINOR,   MODE_NAMES_MELODIC_MINOR_SCALE])
]);

const offsetsPatternsScalesNames = new Map()
    .set('0,2,4,5,7,9,11',  SCALE_NAME_MAJOR)
    .set('0,2,4,5,8,9,11',  SCALE_NAME_HARMONIC_MINOR)
    .set('0,2,4,5,7,8,11',  SCALE_NAME_HARMONIC_MAJOR)
    .set('0,2,3,5,7,9,11',  SCALE_NAME_MELODIC_MINOR);

const offsetsPatternsModesNames = new Map()
    .set('0,2,4,5,7,9,11',  MODE_NAMES_MAJOR_SCALE[0])
    .set('0,2,3,5,7,9,10',  MODE_NAMES_MAJOR_SCALE[1])
    .set('0,1,3,5,7,8,10',  MODE_NAMES_MAJOR_SCALE[2])
    .set('0,2,4,6,7,9,11',  MODE_NAMES_MAJOR_SCALE[3])
    .set('0,2,4,5,7,9,10',  MODE_NAMES_MAJOR_SCALE[4])
    .set('0,2,3,5,7,8,10',  MODE_NAMES_MAJOR_SCALE[5])
    .set('0,1,3,5,6,8,10',  MODE_NAMES_MAJOR_SCALE[6])
    .set('0,2,4,5,8,9,11',  MODE_NAMES_HARMONIC_MINOR_SCALE[0])
    .set('0,2,3,6,7,9,10',  MODE_NAMES_HARMONIC_MINOR_SCALE[1])
    .set('0,1,4,5,7,8,10',  MODE_NAMES_HARMONIC_MINOR_SCALE[2])
    .set('0,3,4,6,7,9,11',  MODE_NAMES_HARMONIC_MINOR_SCALE[3])
    .set('0,1,3,4,6,8,9',   MODE_NAMES_HARMONIC_MINOR_SCALE[4])
    .set('0,2,3,5,7,8,11',  MODE_NAMES_HARMONIC_MINOR_SCALE[5])
    .set('0,1,3,5,6,9,10',  MODE_NAMES_HARMONIC_MINOR_SCALE[6])
    .set('0,2,4,5,7,8,11',  MODE_NAMES_HARMONIC_MAJOR_SCALE[0])
    .set('0,2,3,5,6,9,10',  MODE_NAMES_HARMONIC_MAJOR_SCALE[1])
    .set('0,1,3,4,7,8,10',  MODE_NAMES_HARMONIC_MAJOR_SCALE[2])
    .set('0,2,3,6,7,9,11',  MODE_NAMES_HARMONIC_MAJOR_SCALE[3])
    .set('0,1,4,5,7,9,10',  MODE_NAMES_HARMONIC_MAJOR_SCALE[4])
    .set('0,3,4,6,8,9,11',  MODE_NAMES_HARMONIC_MAJOR_SCALE[5])
    .set('0,1,3,5,6,8,9',   MODE_NAMES_HARMONIC_MAJOR_SCALE[6])
    .set('0,2,3,5,7,9,11',  MODE_NAMES_MELODIC_MINOR_SCALE[0])
    .set('0,1,3,5,7,9,10',  MODE_NAMES_MELODIC_MINOR_SCALE[1])
    .set('0,2,4,6,8,9,11',  MODE_NAMES_MELODIC_MINOR_SCALE[2])
    .set('0,2,4,6,7,9,10',  MODE_NAMES_MELODIC_MINOR_SCALE[3])
    .set('0,2,4,5,7,8,10',  MODE_NAMES_MELODIC_MINOR_SCALE[4])
    .set('0,2,3,5,6,8,10',  MODE_NAMES_MELODIC_MINOR_SCALE[5])
    .set('0,1,3,4,6,8,10',  MODE_NAMES_MELODIC_MINOR_SCALE[6]);

const offsetsPatternsChordNames = new Map()
    .set('0,4,7',           'Major Triad')
    .set('0,3,7',           'Minor Triad')
    .set('0,3,6',           'Diminished Triad')
    .set('0,4,8',           'Augmented Triad')
    .set('0,4,7,11',        'Major Seventh')
    .set('0,3,7,10',        'Minor Seventh')
    .set('0,4,7,10',        'Dominant Seventh')
    .set('0,3,6,10',        'Half-Diminished Seventh')
    .set('0,3,7,11',        'Minor Major Seventh')
    .set('0,4,8,11',        'Augmented Major Seventh')
    .set('0,3,6,9',         'Diminished Seventh');

const cyclicKeyIndex = (keyIndex) => {
  return cyclicIndex(KEY_NAMES.length, keyIndex);
};

const keyNameForIndex = (index) => {
  return KEY_NAMES[cyclicKeyIndex(index)];
};

const indexForKeyName = (keyName) => {
  return KEY_NAME_INDEX[keyName];
};

const chordNameForOffsetsPattern = (chordOffsetsPattern) => {
  return offsetsPatternsChordNames.get(chordOffsetsPattern);
};
const chordNameForOffsets = (chordOffsets) => {
  return chordNameForOffsetsPattern(chordOffsets.join(','));
};

const scaleNameForOffsetsPattern = (scaleOffsetsPattern) => {
  return offsetsPatternsScalesNames.get(scaleOffsetsPattern);
};
const scaleNameForOffsets = (scaleOffsets) => {
  return scaleNameForOffsetsPattern(scaleOffsets.join(','));
};

const modeNameForOffsetsPattern = (modeOffsetsPattern) => {
  return offsetsPatternsModesNames.get(modeOffsetsPattern);
};
const modeNameForOffsets = (modeOffsets) => {
  return modeNameForOffsetsPattern(modeOffsets.join(','));
};


export {
  SCALE_PATTERN_MAJOR, SCALE_PATTERN_HARMONIC_MINOR, SCALE_PATTERN_HARMONIC_MAJOR, SCALE_PATTERN_MELODIC_MINOR,
  SCALE_PATTERNS,
  SCALE_NAME_MAJOR, SCALE_NAME_HARMONIC_MINOR, SCALE_NAME_HARMONIC_MAJOR, SCALE_NAME_MELODIC_MINOR,
  SCALE_NAMES,
  SCALE_MAJOR, SCALE_HARMONIC_MINOR, SCALE_HARMONIC_MAJOR, SCALE_MELODIC_MINOR,
  SCALES,
  MODE_NAMES_MAJOR_SCALE, MODE_NAMES_HARMONIC_MINOR_SCALE, MODE_NAMES_HARMONIC_MAJOR_SCALE, MODE_NAMES_MELODIC_MINOR_SCALE,
  MODES_NAMES,
  SCALES_NAMES_MODES_NAMES,
  KEY_C, KEY_Cs, KEY_Db, KEY_D, KEY_Ds, KEY_Eb, KEY_E, KEY_F, KEY_Fs,
  KEY_Gb, KEY_G, KEY_Gs, KEY_Ab, KEY_A, KEY_As, KEY_Bb, KEY_B,
  KEYS,
  cyclicKeyIndex, keyNameForIndex, KEY_NAMES, KEY_NAME_INDEX, indexForKeyName,
  chordNameForOffsets, chordNameForOffsetsPattern,
  scaleNameForOffsets, scaleNameForOffsetsPattern,
  modeNameForOffsets, modeNameForOffsetsPattern
};
