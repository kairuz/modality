import * as util from "./util.js";


const keyNames = [
  'C',
  'C#/Db',
  'D',
  'D#/Eb',
  'E',
  'F',
  'F#/Gb',
  'G',
  'G#/Ab',
  'A',
  'A#/Bb',
  'B'
];

const keyNameIndex = {
  'C': 0,
  'C#': 1,
  'Db': 1,
  'D': 2,
  'D#': 3,
  'Eb': 3,
  'E': 4,
  'F': 5,
  'F#': 6,
  'Gb': 6,
  'G': 7,
  'G#': 8,
  'Ab': 8,
  'A': 9,
  'A#': 10,
  'Bb': 10,
  'B': 11,
};


const SCALE_PATTERN_MAJOR           = '101011010101';
const SCALE_PATTERN_HARMONIC_MINOR  = '101011001101';
const SCALE_PATTERN_HARMONIC_MAJOR  = '101011011001';
const SCALE_PATTERN_MELODIC_MINOR   = '101101010101';

const SCALE_NAMES = Object.freeze(['Major', 'Harmonic Minor', 'Harmonic Major', 'Melodic Minor']);

const MAJOR_SCALE_MODES_NAMES = Object.freeze([
    'Ionian',
    'Dorian',
    'Phrygian',
    'Lydian',
    'Mixolydian',
    'Aeolian',
    'Locrian'
]);

const HARMONIC_MINOR_SCALE_MODES_NAMES = Object.freeze([
    'Ionian #5 / Augmented Major',
    'Altered Dorian',
    'Phrygian Dominant',
    'Lydian #2',
    'Super Locrian bb7 / Altered Diminished',
    'Harmonic Minor / Aeolian #7',
    'Locrian #6'
]);

const HARMONIC_MAJOR_SCALE_MODES_NAMES = Object.freeze([
    'Harmonic Major / Ionian b6',
    'Dorian b5 / Locrian #2',
    'Phrygian b4',
    'Lydian b3 / Melodic Minor #4',
    'Mixolydian b2',
    'Lydian Augmented #2',
    'Locrian bb7'
]);

const MELODIC_MINOR_SCALE_MODES_NAMES = Object.freeze([
    'Melodic Minor / Jazz Minor',
    'Dorian b2 / Phrygian #6',
    'Lydian Augmented',
    'Lydian Dominant / Overtone',
    'Mixolydian b6 / Aeolian Dominant',
    'Half-diminished / Aeolian b5',
    'Super Locrian / Altered dominant',
]);


const offsetsPatternsScalesNames = new Map()
    .set('0,2,4,5,7,9,11',  SCALE_NAMES[0])
    .set('0,2,4,5,8,9,11',  SCALE_NAMES[1])
    .set('0,2,4,5,7,8,11',  SCALE_NAMES[2])
    .set('0,2,3,5,7,9,11',  SCALE_NAMES[3]);

const offsetsPatternsModesNames = new Map()
    .set('0,2,4,5,7,9,11',  MAJOR_SCALE_MODES_NAMES[0])
    .set('0,2,3,5,7,9,10',  MAJOR_SCALE_MODES_NAMES[1])
    .set('0,1,3,5,7,8,10',  MAJOR_SCALE_MODES_NAMES[2])
    .set('0,2,4,6,7,9,11',  MAJOR_SCALE_MODES_NAMES[3])
    .set('0,2,4,5,7,9,10',  MAJOR_SCALE_MODES_NAMES[4])
    .set('0,2,3,5,7,8,10',  MAJOR_SCALE_MODES_NAMES[5])
    .set('0,1,3,5,6,8,10',  MAJOR_SCALE_MODES_NAMES[6])
    .set('0,2,4,5,8,9,11',  HARMONIC_MINOR_SCALE_MODES_NAMES[0])
    .set('0,2,3,6,7,9,10',  HARMONIC_MINOR_SCALE_MODES_NAMES[1])
    .set('0,1,4,5,7,8,10',  HARMONIC_MINOR_SCALE_MODES_NAMES[2])
    .set('0,3,4,6,7,9,11',  HARMONIC_MINOR_SCALE_MODES_NAMES[3])
    .set('0,1,3,4,6,8,9',   HARMONIC_MINOR_SCALE_MODES_NAMES[4])
    .set('0,2,3,5,7,8,11',  HARMONIC_MINOR_SCALE_MODES_NAMES[5])
    .set('0,1,3,5,6,9,10',  HARMONIC_MINOR_SCALE_MODES_NAMES[6])
    .set('0,2,4,5,7,8,11',  HARMONIC_MAJOR_SCALE_MODES_NAMES[0])
    .set('0,2,3,5,6,9,10',  HARMONIC_MAJOR_SCALE_MODES_NAMES[1])
    .set('0,1,3,4,7,8,10',  HARMONIC_MAJOR_SCALE_MODES_NAMES[2])
    .set('0,2,3,6,7,9,11',  HARMONIC_MAJOR_SCALE_MODES_NAMES[3])
    .set('0,1,4,5,7,9,10',  HARMONIC_MAJOR_SCALE_MODES_NAMES[4])
    .set('0,3,4,6,8,9,11',  HARMONIC_MAJOR_SCALE_MODES_NAMES[5])
    .set('0,1,3,5,6,8,9',   HARMONIC_MAJOR_SCALE_MODES_NAMES[6])
    .set('0,2,3,5,7,9,11',  MELODIC_MINOR_SCALE_MODES_NAMES[0])
    .set('0,1,3,5,7,9,10',  MELODIC_MINOR_SCALE_MODES_NAMES[1])
    .set('0,2,4,6,8,9,11',  MELODIC_MINOR_SCALE_MODES_NAMES[2])
    .set('0,2,4,6,7,9,10',  MELODIC_MINOR_SCALE_MODES_NAMES[3])
    .set('0,2,4,5,7,8,10',  MELODIC_MINOR_SCALE_MODES_NAMES[4])
    .set('0,2,3,5,6,8,10',  MELODIC_MINOR_SCALE_MODES_NAMES[5])
    .set('0,1,3,4,6,8,10',  MELODIC_MINOR_SCALE_MODES_NAMES[6]);

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


const keyNamesLength = keyNames.length;

const cyclicKeyIndex = (keyIndex) => {
  return util.cyclicIndex(keyNames.length, keyIndex);
};

const keyNameForIndex = (index) => {
  return keyNames[cyclicKeyIndex(index)];
};

const indexForKeyName = (keyName) => {
  return keyNameIndex[keyName];
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
    cyclicKeyIndex, keyNameForIndex, keyNamesLength, indexForKeyName,
    chordNameForOffsets, chordNameForOffsetsPattern,
    scaleNameForOffsets, scaleNameForOffsetsPattern,
    modeNameForOffsets, modeNameForOffsetsPattern
};
