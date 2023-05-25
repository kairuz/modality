import * as domain from "./domain.js";
import * as glossary from "./glossary.js";


const CHORD_COLOR_TONIC = 0;
const CHORD_COLOR_CADENCE = 1;
const CHORD_COLORS = Object.freeze([CHORD_COLOR_TONIC, CHORD_COLOR_CADENCE]);

const CHORD_COLOR_TONIC_INDEXES_WEIGHTS = Object.freeze(Object.entries({0: 60, 2: 15, 5: 25}));
const CHORD_COLOR_TONIC_INDEXES_WEIGHTED = Object.freeze(CHORD_COLOR_TONIC_INDEXES_WEIGHTS.reduce(
    (acc, [chordIndex, weight]) => acc.concat(Array(weight).fill(Number(chordIndex))), []));
const CHORD_COLOR_TONIC_INDEXES = Object.freeze(Array.from(CHORD_COLOR_TONIC_INDEXES_WEIGHTS.keys()).map(Number));

const CHORD_COLOR_CADENCE_INDEXES_WEIGHTS = Object.freeze(Object.entries({1: 20, 3: 40, 4: 30, 6: 10}));
const CHORD_COLOR_CADENCE_INDEXES_WEIGHTED = Object.freeze(CHORD_COLOR_CADENCE_INDEXES_WEIGHTS.reduce(
    (acc, [chordIndex, weight]) => acc.concat(Array(weight).fill(Number(chordIndex))), []));
const CHORD_COLOR_CADENCE_INDEXES = Object.freeze(Array.from(CHORD_COLOR_CADENCE_INDEXES_WEIGHTS.keys()).map(Number));

const Composer = () => {
  const scales = domain.SCALES;
  let octave = 4;
  let scaleIndex = 0;

  let parentKeyIndex = glossary.indexForKeyName('C');
  let modeKeyIndex = parentKeyIndex;
  let chordKeyIndex = modeKeyIndex;

  let modeIndex = 0;
  let chordIndex = 0;

  let chordType = domain.CHORD_TYPE_TETRAD;

  const capture = () => {
    return {octave, scaleIndex, parentKeyIndex, modeKeyIndex, chordKeyIndex, modeIndex, chordIndex, chordType};
  };

  const changeScaleIndex = (toScaleIndex) => {
    const prevScaleIndex = scaleIndex;
    scaleIndex = toScaleIndex;

    const fromModeOffset = scales[prevScaleIndex].getModeOffset(0, modeIndex + chordIndex);
    const toModeOffset = scales[toScaleIndex].getModeOffset(0, modeIndex + chordIndex);
    const diff = toModeOffset - fromModeOffset;

    parentKeyIndex = glossary.cyclicKeyIndex(parentKeyIndex + diff);
    modeKeyIndex = glossary.cyclicKeyIndex(modeKeyIndex + diff);
    chordKeyIndex = glossary.cyclicKeyIndex(chordKeyIndex + diff);
  };

  const reset = () => {
    octave = 4;
    scaleIndex = 0;

    parentKeyIndex = glossary.indexForKeyName('C');
    modeKeyIndex = parentKeyIndex;
    chordKeyIndex = modeKeyIndex;

    modeIndex = 0;
    chordIndex = 0;

    chordType = domain.CHORD_TYPE_TETRAD;
  };

  const changeKeyIndex = (toKeyIndex) => {
    const prevKeyIndex = parentKeyIndex;
    parentKeyIndex = toKeyIndex;
    const diff = toKeyIndex - prevKeyIndex;
    modeKeyIndex = glossary.cyclicKeyIndex(modeKeyIndex + diff);
    chordKeyIndex = glossary.cyclicKeyIndex(chordKeyIndex + diff);
  };

  const changeModeIndex = (toModeIndex, isRelative = true) => {
    const prevModeIndex = modeIndex;
    modeIndex = toModeIndex;

    const scaleOffsets = scale().offsets;
    const modeFromOffset = scaleOffsets[prevModeIndex];
    const modeToOffset = scaleOffsets[toModeIndex];
    const offsetDiff = modeToOffset - modeFromOffset;

    if (isRelative) {
      modeKeyIndex = glossary.cyclicKeyIndex(modeKeyIndex + offsetDiff);
      chordKeyIndex = glossary.cyclicKeyIndex(chordKeyIndex + offsetDiff);
    }
    else {
      parentKeyIndex = glossary.cyclicKeyIndex(parentKeyIndex - offsetDiff);
    }
  };

  const changeChordIndex = (toChordIndex) => {
    const prevChordIndex = chordIndex;
    chordIndex = toChordIndex;
    const modeOffsets = scale().getModeOffsets(modeIndex);
    const modeFromOffset = modeOffsets[prevChordIndex];
    const modeToOffset = modeOffsets[toChordIndex];
    const offsetDiff = modeToOffset - modeFromOffset;

    chordKeyIndex = glossary.cyclicKeyIndex(chordKeyIndex + offsetDiff);
  };

  const changeChordType = (_chordType) => {
    if (!domain.CHORD_TYPES.includes(_chordType)) {
      throw 'unknown chord type';
    }
    chordType = _chordType;
  };

  const scale = () => scales[scaleIndex];
  const getModeOffset = (offsetIndex) => scale().getModeOffset(modeIndex + chordIndex, offsetIndex);
  const getModeOffsets = () => scale().getModeOffsets(modeIndex + chordIndex);
  const getChordOffsets = () => scale().getChordOffsets(chordType, modeIndex + chordIndex);
  const getRelativeChordOffsets = (relativeIndex) =>
      scale().getChordOffsets(chordType, modeIndex + chordIndex + relativeIndex)
          .map((o) => o + getModeOffset(relativeIndex) + (Math.trunc(relativeIndex / domain.NOTES) * domain.SEMITONES));

  return Object.freeze({
    capture,
    get scales(){return scales;},
    set octave(_octave){octave = _octave;},
    reset,
    changeScaleIndex,
    changeKeyIndex,
    changeModeIndex,
    changeChordIndex,
    changeChordType,
    get octave(){return octave;},
    get scale(){return scale();},
    get scaleIndex(){return scaleIndex;},
    get parentKeyIndex(){return parentKeyIndex;},
    get modeKeyIndex(){return modeKeyIndex;},
    get chordKeyIndex(){return chordKeyIndex;},
    get modeIndex(){return modeIndex;},
    get chordIndex(){return chordIndex;},
    get chordType(){return chordType;},
    get modeOffsets() {
      return getModeOffsets();
    },
    get chordOffsets() {
      return getChordOffsets();
    },
    getRelativeChordOffsets,
    get chordName() {
      return glossary.chordNameForOffsets(this.chordOffsets);
    },
    toString
  });
};


export {
  CHORD_COLOR_TONIC, CHORD_COLOR_CADENCE, CHORD_COLORS,
  CHORD_COLOR_TONIC_INDEXES_WEIGHTS, CHORD_COLOR_TONIC_INDEXES_WEIGHTED, CHORD_COLOR_TONIC_INDEXES,
  CHORD_COLOR_CADENCE_INDEXES_WEIGHTS, CHORD_COLOR_CADENCE_INDEXES_WEIGHTED, CHORD_COLOR_CADENCE_INDEXES,
  Composer
};
