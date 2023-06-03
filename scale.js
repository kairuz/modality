const NOTES = 7;
const SEMITONES = 12;
const TETRAD_NOTES = 4;
const TRIAD_NOTES = 3;
const CHORD_TYPE_TRIAD = 0;
const CHORD_TYPE_TETRAD = 1;
const CHORD_TYPES = Object.freeze([CHORD_TYPE_TRIAD, CHORD_TYPE_TETRAD]);


const patternToFlags = (pattern) => {
  if (typeof pattern !== 'string' ||
      pattern.length !== SEMITONES ||
      [...pattern].some((f) => !(f === '1' || f === '0')) ||
      [...pattern].filter((f) => f === '1').length !== NOTES) {
    throw 'invalid heptatonic scale pattern';
  }

  return [...pattern].map(Number);
};


const flagsToModeFlagsAtIndex = (flags, i) => {
  return flags.slice(i, flags.length).concat(flags.slice(0, i));
};

const flagsToModeFlags = (flags, n) => {
  const i = (() => {
    let temp = 0;
    for (let i = 0; i < flags.length; i++) {
      temp += flags[i];
      if (temp > n) {
        return i;
      }
    }
    throw 'n not reached in flags';
  })();

  return flagsToModeFlagsAtIndex(flags, i);
};

const flagsToIntervals = (modeFlags) => {
  let startI = null;
  let endI = null;
  return modeFlags.reduce((acc, flag, i) => {
    if (flag === 1) {
      if (startI === null) {
        startI = i;
      }
      else if (endI === null) {
        endI = i;
      }

      if (startI !== null && endI !== null) {
        acc.push(endI - startI);
      }
      startI = i;
      endI = null;
    }

    if (i === modeFlags.length - 1) {
      endI = modeFlags.length;
      acc.push(endI - startI);
    }

    return acc;

  }, []);
};

const flagsToOffsets = (modeFlags) => {
  return modeFlags
      .map((flag, i) => [flag, i])
      .filter(([flag, ]) => flag === 1)
      .map(([, i]) => i)
};

const modeOffsetsToTetradOffsets = (modeOffsets) => {
  return modeOffsets.filter((_, i) => i % 2 === 0)
};

const tetradOffsetsToTriadOffsets = (tetradOffsets) => {
  return tetradOffsets.slice(0, -1);
};

const offsetsToIntervals = (offsets, semitones = null) => {
  if (!Array.isArray(offsets) || offsets.some((o) => !Number.isInteger(o))) {
    throw 'invalid offsets';
  }
  if (semitones !== null && !Number.isInteger(semitones)) {
    throw 'invalid semitones';
  }

  return offsets.reduce((acc, offset, i) => {
    if (i !== offsets.length - 1) {
      acc.push(offsets[i + 1] - offsets[i]);
    }
    else if (semitones !== null) {
      acc.push(semitones - offsets[offsets.length - 1]);
    }
    return acc;
  }, []);
};

const Scale = (pattern) => {

  const flags = Object.freeze(patternToFlags(pattern));

  const modesFlags = Object.freeze(flags.reduce((acc, flag, i) => {
    if (flag === 1) {
      acc.push(Object.freeze(flagsToModeFlagsAtIndex(flags, i)));
    }
    return acc;
  }, []));

  const modesOffsets = Object.freeze(modesFlags.map(
      (modeFlags) => Object.freeze(flagsToOffsets(modeFlags))));

  const modesIntervals = Object.freeze(modesOffsets.map(
      (modesOffset) => Object.freeze(offsetsToIntervals(modesOffset, SEMITONES))));

  const tetradsOffsets = Object.freeze(modesOffsets.map(
      (modeOffsets) => Object.freeze(modeOffsetsToTetradOffsets(modeOffsets))));

  const tetradsIntervals = Object.freeze(tetradsOffsets.map(
      (tetradOffsets) => Object.freeze(offsetsToIntervals(tetradOffsets))));

  const triadsOffsets = Object.freeze(tetradsOffsets.map(
      (tetradOffsets) => Object.freeze(tetradOffsetsToTriadOffsets(tetradOffsets))));

  const triadsIntervals = Object.freeze(triadsOffsets.map(
      (triadOffsets) => Object.freeze(offsetsToIntervals(triadOffsets))));

  const getChordsOffsets = (chordType) => {
    if (!CHORD_TYPES.includes(chordType)) {
      throw 'invalid chordType';
    }
    return chordType === CHORD_TYPE_TETRAD ? tetradsOffsets : triadsOffsets;
  };

  const getChordOffsets = (chordType, index) => {
    if (!CHORD_TYPES.includes(chordType)) {
      throw 'invalid chordType';
    }
    if (!Number.isInteger(index) || index < 0) {
      throw 'invalid index';
    }
    return chordType === CHORD_TYPE_TETRAD ? tetradsOffsets[index % NOTES] : triadsOffsets[index % NOTES];
  };

  const getChordOffset = (chordType, chordIndex, offsetIndex) => {
    if (!CHORD_TYPES.includes(chordType)) {
      throw 'invalid chordType';
    }
    if (!Number.isInteger(chordIndex) || chordIndex < 0 || !Number.isInteger(offsetIndex) || offsetIndex < 0) {
      throw 'invalid index';
    }
    return chordType === CHORD_TYPE_TETRAD ?
           tetradsOffsets[chordIndex % NOTES][offsetIndex % TETRAD_NOTES] :
           triadsOffsets[chordIndex % NOTES][offsetIndex % TRIAD_NOTES];
  };


  return {
    get pattern(){return pattern;},

    get flags(){return flags;},
    getFlag: (index) => flags[index % SEMITONES],
    get offsets(){return modesOffsets[0];},
    getOffset: (index) => modesOffsets[0][index % NOTES],
    get intervals(){return modesIntervals[0];},
    getInterval: (index) => modesIntervals[0][index % NOTES],

    get notes(){return NOTES;},
    get semitones(){return SEMITONES;},

    get modesFlags(){return modesFlags;},
    getModeFlags: (index) => modesFlags[index % NOTES],
    getModeFlag: (modeIndex, flagIndex) => modesFlags[modeIndex % NOTES][flagIndex % SEMITONES],
    get modesOffsets(){return modesOffsets;},
    getModeOffsets: (index) => modesOffsets[index % NOTES],
    getModeOffset: (modeIndex, offsetIndex) => modesOffsets[modeIndex % NOTES][offsetIndex % NOTES],
    get modesIntervals(){return modesIntervals;},
    getModeIntervals: (index) => modesIntervals[index % NOTES],
    getModeInterval: (modeIndex, intervalIndex) => modesIntervals[modeIndex % NOTES][intervalIndex % NOTES],
    get tetradsOffsets(){return tetradsOffsets;},
    getTetradOffsets: (index) => tetradsOffsets[index % NOTES],
    getTetradOffset: (chordIndex, offsetIndex) => tetradsOffsets[chordIndex % NOTES][offsetIndex % TETRAD_NOTES],
    getChordsOffsets,
    getChordOffsets,
    getChordOffset,
    get tetradsIntervals(){return tetradsIntervals;},
    getTetradIntervals: (index) => tetradsIntervals[index % NOTES],
    getTetradInterval: (chordIndex, intervalIndex) => tetradsOffsets[chordIndex % NOTES][intervalIndex % TETRAD_NOTES],
    get triadsOffsets(){return triadsOffsets;},
    getTriadOffsets: (index) => triadsOffsets[index % NOTES],
    getTriadOffset: (chordIndex, offsetIndex) => triadsOffsets[chordIndex % NOTES][offsetIndex % TRIAD_NOTES],
    get triadsIntervals(){return triadsIntervals;},
    getTriadIntervals: (index) => triadsIntervals[index % NOTES],
    getTriadInterval: (chordIndex, intervalIndex) => triadsIntervals[chordIndex % NOTES][intervalIndex % TRIAD_NOTES]
  };

};


export {
  CHORD_TYPE_TRIAD, CHORD_TYPE_TETRAD, CHORD_TYPES,
  NOTES, SEMITONES, TETRAD_NOTES, TRIAD_NOTES,
  patternToFlags, flagsToModeFlagsAtIndex,
  flagsToModeFlags, flagsToIntervals, flagsToOffsets, offsetsToIntervals,
  modeOffsetsToTetradOffsets, tetradOffsetsToTriadOffsets,
  Scale
};
