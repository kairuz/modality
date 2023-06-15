import * as scaleLib from './scale.js';


const assertEqual = (var1, var2, message) => {
  const isEqual = var1 === var2;
  console.assert(isEqual, message);
};

const assertArraysElemsEqual = (arr1, arr2, message) => {
  const arraysElemsEqual = (arr1, arr2) => {
    return arr1.length === arr2.length &&
           arr1.filter((val1, i) => {
             if (val1 !== arr2[i]) {
               return true;
             }
           }).length === 0;
  };

  const isEqual = arraysElemsEqual(arr1, arr2);

  console.assert(isEqual, message);
};

const assertError = (callback, message) => {
  const errored = (() => {
    try {
      callback();
      return false;
    }
    catch {
      return true;
    }
  })();

  console.assert(errored, message);
};

const testPatternToFlags = () => {
  {
    const input = '8970807023';
    assertError(() => scaleLib.patternToFlags(input), `patternToFlags expected error for input ${input}`);
  }
  {
    const input = 101011010101;
    assertError(() => scaleLib.patternToFlags(input), `patternToFlags expected error for input ${input}`);
  }
  {
    const input = '101011010100';
    assertError(() => scaleLib.patternToFlags(input), `patternToFlags expected error for input ${input}`);
  }
  {
    const input = '10101101011';
    assertError(() => scaleLib.patternToFlags(input), `patternToFlags expected error for input ${input}`);
  }
  {
    const input = [1, 1, 1, 1, 1, 0];
    assertError(() => scaleLib.patternToFlags(input), `patternToFlags expected error for input ${input}`);
  }
  {
    const expected = [1,0,1,0,1,1,0,1,0,1,0,1];
    const actual = scaleLib.patternToFlags('101011010101');
    assertArraysElemsEqual(expected, actual, `patternToFlags error: expected ${expected}, actual ${actual}`);
  }

};

const testFlagsToModeFlagsAtIndex = () => {
  {
    const expected = [1,0,1,0,1,1,0,1,0,1,0,1];
    const actual = scaleLib.flagsToModeFlagsAtIndex([1,0,1,0,1,1,0,1,0,1,0,1], 0);
    assertArraysElemsEqual(expected, actual, `flagsToModeFlagsAtIndex error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [1,0,1,1,0,1,0,1,0,1,1,0];
    const actual = scaleLib.flagsToModeFlagsAtIndex([1,0,1,0,1,1,0,1,0,1,0,1], 2);
    assertArraysElemsEqual(expected, actual, `flagsToModeFlagsAtIndex error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [1,1,0,1,0,1,0,1,1,0,1,0,];
    const actual = scaleLib.flagsToModeFlagsAtIndex([1,0,1,0,1,1,0,1,0,1,0,1], 4);
    assertArraysElemsEqual(expected, actual, `flagsToModeFlagsAtIndex error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [1,0,1,0,1,0,1,1,0,1,0,1];
    const actual = scaleLib.flagsToModeFlagsAtIndex([1,0,1,0,1,1,0,1,0,1,0,1], 5);
    assertArraysElemsEqual(expected, actual, `flagsToModeFlagsAtIndex error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [1,0,1,0,1,1,0,1,0,1,1,0];
    const actual = scaleLib.flagsToModeFlagsAtIndex([1,0,1,0,1,1,0,1,0,1,0,1], 7);
    assertArraysElemsEqual(expected, actual, `flagsToModeFlagsAtIndex error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [1,0,1,1,0,1,0,1,1,0,1,0];
    const actual = scaleLib.flagsToModeFlagsAtIndex([1,0,1,0,1,1,0,1,0,1,0,1], 9);
    assertArraysElemsEqual(expected, actual, `flagsToModeFlagsAtIndex error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [1,1,0,1,0,1,1,0,1,0,1,0];
    const actual = scaleLib.flagsToModeFlagsAtIndex([1,0,1,0,1,1,0,1,0,1,0,1], 11);
    assertArraysElemsEqual(expected, actual, `flagsToModeFlagsAtIndex error: expected ${expected}, actual ${actual}`);
  }
};

const testFlagsToModeFlags = () => {
  {
    const expected = [1,0,1,0,1,1,0,1,0,1,0,1];
    const actual = scaleLib.flagsToModeFlags([1,0,1,0,1,1,0,1,0,1,0,1], 0);
    assertArraysElemsEqual(expected, actual, `flagsToModeFlags error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [1,0,1,1,0,1,0,1,0,1,1,0];
    const actual = scaleLib.flagsToModeFlags([1,0,1,0,1,1,0,1,0,1,0,1], 1);
    assertArraysElemsEqual(expected, actual, `flagsToModeFlags error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [1,1,0,1,0,1,0,1,1,0,1,0];
    const actual = scaleLib.flagsToModeFlags([1,0,1,0,1,1,0,1,0,1,0,1], 2);
    assertArraysElemsEqual(expected, actual, `flagsToModeFlags error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [1,0,1,0,1,0,1,1,0,1,0,1];
    const actual = scaleLib.flagsToModeFlags([1,0,1,0,1,1,0,1,0,1,0,1], 3);
    assertArraysElemsEqual(expected, actual, `flagsToModeFlags error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [1,0,1,0,1,1,0,1,0,1,1,0];
    const actual = scaleLib.flagsToModeFlags([1,0,1,0,1,1,0,1,0,1,0,1], 4);
    assertArraysElemsEqual(expected, actual, `flagsToModeFlags error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [1,0,1,1,0,1,0,1,1,0,1,0];
    const actual = scaleLib.flagsToModeFlags([1,0,1,0,1,1,0,1,0,1,0,1], 5);
    assertArraysElemsEqual(expected, actual, `flagsToModeFlags error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [1,1,0,1,0,1,1,0,1,0,1,0];
    const actual = scaleLib.flagsToModeFlags([1,0,1,0,1,1,0,1,0,1,0,1], 6);
    assertArraysElemsEqual(expected, actual, `flagsToModeFlags error: expected ${expected}, actual ${actual}`);
  }
};

const testFlagsToIntervals = () => {
  {
    const expected = [2,2,1,2,2,2,1];
    const actual = scaleLib.flagsToIntervals([1,0,1,0,1,1,0,1,0,1,0,1]);
    assertArraysElemsEqual(expected, actual, `flagsToIntervals error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [2,2,1,2,2,2,1];
    const actual = scaleLib.flagsToIntervals([1,0,1,0,1,1,0,1,0,1,0,1]);
    assertArraysElemsEqual(expected, actual, `flagsToIntervals error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [2,1,2,2,2,1,2];
    const actual = scaleLib.flagsToIntervals([1,0,1,1,0,1,0,1,0,1,1,0]);
    assertArraysElemsEqual(expected, actual, `flagsToIntervals error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [1,2,2,2,1,2,2];
    const actual = scaleLib.flagsToIntervals([1,1,0,1,0,1,0,1,1,0,1,0]);
    assertArraysElemsEqual(expected, actual, `flagsToIntervals error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [2,2,2,1,2,2,1];
    const actual = scaleLib.flagsToIntervals([1,0,1,0,1,0,1,1,0,1,0,1]);
    assertArraysElemsEqual(expected, actual, `flagsToIntervals error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [2,2,1,2,2,1,2];
    const actual = scaleLib.flagsToIntervals([1,0,1,0,1,1,0,1,0,1,1,0]);
    assertArraysElemsEqual(expected, actual, `flagsToIntervals error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [2,1,2,2,1,2,2];
    const actual = scaleLib.flagsToIntervals([1,0,1,1,0,1,0,1,1,0,1,0]);
    assertArraysElemsEqual(expected, actual, `flagsToIntervals error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [1,2,2,1,2,2,2];
    const actual = scaleLib.flagsToIntervals([1,1,0,1,0,1,1,0,1,0,1,0]);
    assertArraysElemsEqual(expected, actual, `flagsToIntervals error: expected ${expected}, actual ${actual}`);
  }

};

const testFlagsToOffsets = () => {
  {
    const expected = [0, 2, 4, 5, 7, 9, 11];
    const actual = scaleLib.flagsToOffsets([1,0,1,0,1,1,0,1,0,1,0,1]);
    assertArraysElemsEqual(expected, actual, `flagsToOffsets error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [0, 2, 3, 5, 7, 9, 10];
    const actual = scaleLib.flagsToOffsets([1,0,1,1,0,1,0,1,0,1,1,0]);
    assertArraysElemsEqual(expected, actual, `flagsToOffsets error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [0, 1, 3, 5, 7, 8, 10];
    const actual = scaleLib.flagsToOffsets([1,1,0,1,0,1,0,1,1,0,1,0]);
    assertArraysElemsEqual(expected, actual, `flagsToOffsets error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [0, 2, 4, 6, 7, 9, 11];
    const actual = scaleLib.flagsToOffsets([1,0,1,0,1,0,1,1,0,1,0,1]);
    assertArraysElemsEqual(expected, actual, `flagsToOffsets error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [0, 2, 4, 5, 7, 9, 10];
    const actual = scaleLib.flagsToOffsets([1,0,1,0,1,1,0,1,0,1,1,0]);
    assertArraysElemsEqual(expected, actual, `flagsToOffsets error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [0, 2, 3, 5, 7, 8, 10];
    const actual = scaleLib.flagsToOffsets([1,0,1,1,0,1,0,1,1,0,1,0]);
    assertArraysElemsEqual(expected, actual, `flagsToOffsets error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [0, 1, 3, 5, 6, 8, 10];
    const actual = scaleLib.flagsToOffsets([1,1,0,1,0,1,1,0,1,0,1,0]);
    assertArraysElemsEqual(expected, actual, `flagsToOffsets error: expected ${expected}, actual ${actual}`);
  }
};

const testOffsetsToIntervals = () => {
  {
    const input = ['a', 'b', 'c'];
    assertError(() => scaleLib.patternToFlags(input), `offsetsToIntervals expected error for input ${input}`);
  }
  {
    const input = [1, 1.2, 2];
    assertError(() => scaleLib.patternToFlags(input), `offsetsToIntervals expected error for input ${input}`);
  }
  {
    const input = null;
    assertError(() => scaleLib.patternToFlags(input), `offsetsToIntervals expected error for input ${input}`);
  }
  {
    const input = [[2, 2, 1, 2, 2, 2, 1], 'a'];
    assertError(() => scaleLib.patternToFlags(...input), `offsetsToIntervals expected error for input ${input}`);
  }
  {
    const expected = [2, 2, 1, 2, 2, 2, 1];
    const actual = scaleLib.offsetsToIntervals([0, 2, 4, 5, 7, 9, 11], 12);
    assertArraysElemsEqual(expected, actual, `offsetsToIntervals error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [2, 2, 1, 2, 2, 2];
    const actual = scaleLib.offsetsToIntervals([0, 2, 4, 5, 7, 9, 11]);
    assertArraysElemsEqual(expected, actual, `offsetsToIntervals error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [4, 3, 4];
    const actual = scaleLib.offsetsToIntervals([0, 4, 7, 11]);
    assertArraysElemsEqual(expected, actual, `offsetsToIntervals error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [3, 4, 3];
    const actual = scaleLib.offsetsToIntervals([0, 3, 7, 10]);
    assertArraysElemsEqual(expected, actual, `offsetsToIntervals error: expected ${expected}, actual ${actual}`);
  }
};

const testModeOffsetsToTetradOffsets = () => {
  {
    const expected = [0, 4, 7, 11];
    const actual = scaleLib.modeOffsetsToTetradOffsets([0, 2, 4, 5, 7, 9, 11]);
    assertArraysElemsEqual(expected, actual, `modeOffsetsToTetradOffsets error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [0, 3, 7, 10];
    const actual = scaleLib.modeOffsetsToTetradOffsets([0, 2, 3, 5, 7, 9, 10]);
    assertArraysElemsEqual(expected, actual, `modeOffsetsToTetradOffsets error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [0, 3, 7, 10];
    const actual = scaleLib.modeOffsetsToTetradOffsets([0, 1, 3, 5, 7, 8, 10]);
    assertArraysElemsEqual(expected, actual, `modeOffsetsToTetradOffsets error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [0, 4, 7, 11];
    const actual = scaleLib.modeOffsetsToTetradOffsets([0, 2, 4, 6, 7, 9, 11]);
    assertArraysElemsEqual(expected, actual, `modeOffsetsToTetradOffsets error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [0, 4, 7, 10];
    const actual = scaleLib.modeOffsetsToTetradOffsets([0, 2, 4, 5, 7, 9, 10]);
    assertArraysElemsEqual(expected, actual, `modeOffsetsToTetradOffsets error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [0, 3, 7, 10];
    const actual = scaleLib.modeOffsetsToTetradOffsets([0, 2, 3, 5, 7, 8, 10]);
    assertArraysElemsEqual(expected, actual, `modeOffsetsToTetradOffsets error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [0, 3, 6, 10];
    const actual = scaleLib.modeOffsetsToTetradOffsets([0, 1, 3, 5, 6, 8, 10]);
    assertArraysElemsEqual(expected, actual, `modeOffsetsToTetradOffsets error: expected ${expected}, actual ${actual}`);
  }
};

const testTetradOffsetsToTriadOffsets = () => {
  {
    const expected = [0, 4, 7];
    const actual = scaleLib.tetradOffsetsToTriadOffsets([0, 4, 7, 11]);
    assertArraysElemsEqual(expected, actual, `tetradOffsetsToTriadOffsets error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [0, 3, 7];
    const actual = scaleLib.tetradOffsetsToTriadOffsets([0, 3, 7, 10]);
    assertArraysElemsEqual(expected, actual, `tetradOffsetsToTriadOffsets error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [0, 4, 7];
    const actual = scaleLib.tetradOffsetsToTriadOffsets([0, 4, 7, 10]);
    assertArraysElemsEqual(expected, actual, `tetradOffsetsToTriadOffsets error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [0, 3, 6];
    const actual = scaleLib.tetradOffsetsToTriadOffsets([0, 3, 6, 10]);
    assertArraysElemsEqual(expected, actual, `tetradOffsetsToTriadOffsets error: expected ${expected}, actual ${actual}`);
  }

};

const testScale = () => {
  {
    const expectedPattern = '101011010101';
    const expectedFlags = [1,0,1,0,1,1,0,1,0,1,0,1];
    const expectedNotes = 7;
    const expectedSemitones = 12;
    const expectedMode0Flags = [1,0,1,0,1,1,0,1,0,1,0,1];
    const expectedMode3Flags = [1,0,1,0,1,0,1,1,0,1,0,1];
    const expectedMode0Offsets = [0, 2, 4, 5, 7, 9, 11];
    const expectedMode5Offsets = [0, 2, 3, 5, 7, 8, 10];
    const expectedModes0Intervals = [2,2,1,2,2,2,1];
    const expectedModes1Intervals = [2,1,2,2,2,1,2];
    const expectedTetrads0Offsets = [0, 4, 7, 11];
    const expectedTetrads4Offsets = [0, 4, 7, 10];
    const expectedTetrads6Offsets = [0, 3, 6, 10];
    const expectedTetrads0Intervals = [4, 3, 4];
    const expectedTetrads4Intervals = [4, 3, 3];
    const expectedTetrads6Intervals = [3, 3, 4];
    const expectedTriads0Offsets = [0, 4, 7];
    const expectedTriads1Offsets = [0, 3, 7];
    const expectedTriads6Offsets = [0, 3, 6];
    const expectedTriads0Intervals = [4, 3];
    const expectedTriads1Intervals = [3, 4];
    const expectedTriads6Intervals = [3, 3];

    const actual = scaleLib.Scale('101011010101');

    assertEqual(expectedPattern, actual.pattern, `scale.pattern error: expected ${expectedPattern}, actual ${actual.pattern}`);
    assertArraysElemsEqual(expectedFlags,  actual.flags, `scale.flags error: expected ${expectedFlags}, actual ${actual.flags}`);
    assertEqual(expectedNotes, actual.notes, `scale.notes error: expected ${expectedNotes}, actual ${actual.notes}`);
    assertEqual(expectedSemitones, actual.semitones, `scale.semitones error: expected ${expectedSemitones}, actual ${actual.semitones}`);
    assertArraysElemsEqual(expectedMode0Flags, actual.modesFlags[0], `scale.modesFlags[0] error: expected ${expectedMode0Flags}, actual ${actual.modesFlags[0]}`);
    assertArraysElemsEqual(expectedMode3Flags, actual.modesFlags[3], `scale.modesFlags[3] error: expected ${expectedMode3Flags}, actual ${actual.modesFlags[3]}`);
    assertArraysElemsEqual(expectedMode0Offsets, actual.modesOffsets[0], `scale.modesOffsets[0] error: expected ${expectedMode0Offsets}, actual ${actual.modesOffsets[0]}`);
    assertArraysElemsEqual(expectedMode5Offsets, actual.modesOffsets[5], `scale.modesOffsets[5] error: expected ${expectedMode5Offsets}, actual ${actual.modesOffsets[5]}`);
    assertArraysElemsEqual(expectedModes0Intervals, actual.modesIntervals[0], `scale.modesIntervals[0] error: expected ${expectedModes0Intervals}, actual ${actual.modesIntervals[0]}`);
    assertArraysElemsEqual(expectedModes1Intervals, actual.modesIntervals[1], `scale.modesIntervals[1] error: expected ${expectedModes1Intervals}, actual ${actual.modesIntervals[1]}`);
    assertArraysElemsEqual(expectedTetrads0Offsets, actual.tetradsOffsets[0], `scale.tetradsOffsets[0] error: expected ${expectedTetrads0Offsets}, actual ${actual.tetradsOffsets[0]}`);
    assertArraysElemsEqual(expectedTetrads4Offsets, actual.tetradsOffsets[4], `scale.tetradsOffsets[4] error: expected ${expectedTetrads4Offsets}, actual ${actual.tetradsOffsets[4]}`);
    assertArraysElemsEqual(expectedTetrads6Offsets, actual.tetradsOffsets[6], `scale.tetradsOffsets[6] error: expected ${expectedTetrads6Offsets}, actual ${actual.tetradsOffsets[6]}`);
    assertArraysElemsEqual(expectedTetrads0Intervals, actual.tetradsIntervals[0], `scale.tetradsIntervals[0] error: expected ${expectedTetrads0Intervals}, actual ${actual.tetradsIntervals[0]}`);
    assertArraysElemsEqual(expectedTetrads4Intervals, actual.tetradsIntervals[4], `scale.tetradsIntervals[4] error: expected ${expectedTetrads4Intervals}, actual ${actual.tetradsIntervals[4]}`);
    assertArraysElemsEqual(expectedTetrads6Intervals, actual.tetradsIntervals[6], `scale.tetradsIntervals[6] error: expected ${expectedTetrads6Intervals}, actual ${actual.tetradsIntervals[6]}`);
    assertArraysElemsEqual(expectedTriads0Offsets, actual.triadsOffsets[0], `scale.triadsOffsets[0] error: expected ${expectedTriads0Offsets}, actual ${actual.triadsOffsets[0]}`);
    assertArraysElemsEqual(expectedTriads1Offsets, actual.triadsOffsets[1], `scale.triadsOffsets[1] error: expected ${expectedTriads1Offsets}, actual ${actual.triadsOffsets[1]}`);
    assertArraysElemsEqual(expectedTriads6Offsets, actual.triadsOffsets[6], `scale.triadsOffsets[6] error: expected ${expectedTriads6Offsets}, actual ${actual.triadsOffsets[6]}`);
    assertArraysElemsEqual(expectedTriads0Intervals, actual.triadsIntervals[0], `scale.triadsIntervals[0] error: expected ${expectedTriads0Intervals}, actual ${actual.triadsIntervals[0]}`);
    assertArraysElemsEqual(expectedTriads1Intervals, actual.triadsIntervals[1], `scale.triadsIntervals[1] error: expected ${expectedTriads1Intervals}, actual ${actual.triadsIntervals[1]}`);
    assertArraysElemsEqual(expectedTriads6Intervals, actual.triadsIntervals[6], `scale.triadsIntervals[6] error: expected ${expectedTriads6Intervals}, actual ${actual.triadsIntervals[6]}`);
  }
  {
    const expectedPattern = '101011011001';
    const expectedFlags = [1,0,1,0,1,1,0,1,1,0,0,1];
    const expectedNotes = 7;
    const expectedSemitones = 12;
    const expectedMode0Flags = [1,0,1,0,1,1,0,1,1,0,0,1];
    const expectedMode3Flags = [1,0,1,1,0,0,1,1,0,1,0,1];
    const expectedMode0Offsets = [0, 2, 4, 5, 7, 8, 11];
    const expectedMode5Offsets = [0, 3, 4, 6, 8, 9, 11];
    const expectedModes0Intervals = [2,2,1,2,1,3,1];
    const expectedModes1Intervals = [2,1,2,1,3,1,2];
    const expectedTetrads0Offsets = [0, 4, 7, 11];
    const expectedTetrads4Offsets = [0, 4, 7, 10];
    const expectedTetrads6Offsets = [0, 3, 6, 9];
    const expectedTetrads0Intervals = [4, 3, 4];
    const expectedTetrads4Intervals = [4, 3, 3];
    const expectedTetrads6Intervals = [3, 3, 3];
    const expectedTriads0Offsets = [0, 4, 7];
    const expectedTriads1Offsets = [0, 3, 6];
    const expectedTriads6Offsets = [0, 3, 6];
    const expectedTriads0Intervals = [4, 3];
    const expectedTriads1Intervals = [3, 3];
    const expectedTriads6Intervals = [3, 3];

    const actual = scaleLib.Scale('101011011001');

    assertEqual(expectedPattern, actual.pattern, `scale.pattern error: expected ${expectedPattern}, actual ${actual.pattern}`);
    assertArraysElemsEqual(expectedFlags,  actual.flags, `scale.flags error: expected ${expectedFlags}, actual ${actual.flags}`);
    assertEqual(expectedNotes, actual.notes, `scale.notes error: expected ${expectedNotes}, actual ${actual.notes}`);
    assertEqual(expectedSemitones, actual.semitones, `scale.semitones error: expected ${expectedSemitones}, actual ${actual.semitones}`);
    assertArraysElemsEqual(expectedMode0Flags, actual.modesFlags[0], `scale.modesFlags[0] error: expected ${expectedMode0Flags}, actual ${actual.modesFlags[0]}`);
    assertArraysElemsEqual(expectedMode3Flags, actual.modesFlags[3], `scale.modesFlags[3] error: expected ${expectedMode3Flags}, actual ${actual.modesFlags[3]}`);
    assertArraysElemsEqual(expectedMode0Offsets, actual.modesOffsets[0], `scale.modesOffsets[0] error: expected ${expectedMode0Offsets}, actual ${actual.modesOffsets[0]}`);
    assertArraysElemsEqual(expectedMode5Offsets, actual.modesOffsets[5], `scale.modesOffsets[5] error: expected ${expectedMode5Offsets}, actual ${actual.modesOffsets[5]}`);
    assertArraysElemsEqual(expectedModes0Intervals, actual.modesIntervals[0], `scale.modesIntervals[0] error: expected ${expectedModes0Intervals}, actual ${actual.modesIntervals[0]}`);
    assertArraysElemsEqual(expectedModes1Intervals, actual.modesIntervals[1], `scale.modesIntervals[1] error: expected ${expectedModes1Intervals}, actual ${actual.modesIntervals[1]}`);
    assertArraysElemsEqual(expectedTetrads0Offsets, actual.tetradsOffsets[0], `scale.tetradsOffsets[0] error: expected ${expectedTetrads0Offsets}, actual ${actual.tetradsOffsets[0]}`);
    assertArraysElemsEqual(expectedTetrads4Offsets, actual.tetradsOffsets[4], `scale.tetradsOffsets[4] error: expected ${expectedTetrads4Offsets}, actual ${actual.tetradsOffsets[4]}`);
    assertArraysElemsEqual(expectedTetrads6Offsets, actual.tetradsOffsets[6], `scale.tetradsOffsets[6] error: expected ${expectedTetrads6Offsets}, actual ${actual.tetradsOffsets[6]}`);
    assertArraysElemsEqual(expectedTetrads0Intervals, actual.tetradsIntervals[0], `scale.tetradsIntervals[0] error: expected ${expectedTetrads0Intervals}, actual ${actual.tetradsIntervals[0]}`);
    assertArraysElemsEqual(expectedTetrads4Intervals, actual.tetradsIntervals[4], `scale.tetradsIntervals[4] error: expected ${expectedTetrads4Intervals}, actual ${actual.tetradsIntervals[4]}`);
    assertArraysElemsEqual(expectedTetrads6Intervals, actual.tetradsIntervals[6], `scale.tetradsIntervals[6] error: expected ${expectedTetrads6Intervals}, actual ${actual.tetradsIntervals[6]}`);
    assertArraysElemsEqual(expectedTriads0Offsets, actual.triadsOffsets[0], `scale.triadsOffsets[0] error: expected ${expectedTriads0Offsets}, actual ${actual.triadsOffsets[0]}`);
    assertArraysElemsEqual(expectedTriads1Offsets, actual.triadsOffsets[1], `scale.triadsOffsets[1] error: expected ${expectedTriads1Offsets}, actual ${actual.triadsOffsets[1]}`);
    assertArraysElemsEqual(expectedTriads6Offsets, actual.triadsOffsets[6], `scale.triadsOffsets[6] error: expected ${expectedTriads6Offsets}, actual ${actual.triadsOffsets[6]}`);
    assertArraysElemsEqual(expectedTriads0Intervals, actual.triadsIntervals[0], `scale.triadsIntervals[0] error: expected ${expectedTriads0Intervals}, actual ${actual.triadsIntervals[0]}`);
    assertArraysElemsEqual(expectedTriads1Intervals, actual.triadsIntervals[1], `scale.triadsIntervals[1] error: expected ${expectedTriads1Intervals}, actual ${actual.triadsIntervals[1]}`);
    assertArraysElemsEqual(expectedTriads6Intervals, actual.triadsIntervals[6], `scale.triadsIntervals[6] error: expected ${expectedTriads6Intervals}, actual ${actual.triadsIntervals[6]}`);
  }

};


export {
  testPatternToFlags, testFlagsToModeFlagsAtIndex, testFlagsToModeFlags,
  testFlagsToIntervals, testFlagsToOffsets, testOffsetsToIntervals,
  testModeOffsetsToTetradOffsets, testTetradOffsetsToTriadOffsets,
  testScale
};
