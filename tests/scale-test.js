import * as scaleLib from '../scale.js';
import {test} from 'uvu';
import * as assert from 'uvu/assert';


[
  () => {
    const input = '8970807023';
    assert.throws(() => scaleLib.patternToFlags(input), undefined, `patternToFlags expected error for input ${input}`);
  },
  () => {
    const input = 101011010101;
    assert.throws(() => scaleLib.patternToFlags(input), undefined, `patternToFlags expected error for input ${input}`);
  },
  () => {
    const input = '101011010100';
    assert.throws(() => scaleLib.patternToFlags(input), undefined, `patternToFlags expected error for input ${input}`);
  },
  () => {
    const input = '10101101011';
    assert.throws(() => scaleLib.patternToFlags(input), undefined, `patternToFlags expected error for input ${input}`);
  },
  () => {
    const input = [1, 1, 1, 1, 1, 0];
    assert.throws(() => scaleLib.patternToFlags(input), undefined, `patternToFlags expected error for input ${input}`);
  },
  () => {
    const expected = [1,0,1,0,1,1,0,1,0,1,0,1];
    const actual = scaleLib.patternToFlags('101011010101');
    assert.equal(actual, expected, `patternToFlags error: actual ${actual}, expected ${expected}`);
  }
].forEach((tf) => test('should convert pattern string to flags array', tf));

[
  () => {
    const expected = [1,0,1,0,1,1,0,1,0,1,0,1];
    const actual = scaleLib.flagsToModeFlagsAtIndex([1,0,1,0,1,1,0,1,0,1,0,1], 0);
    assert.equal(actual, expected, `flagsToModeFlagsAtIndex error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [1,0,1,1,0,1,0,1,0,1,1,0];
    const actual = scaleLib.flagsToModeFlagsAtIndex([1,0,1,0,1,1,0,1,0,1,0,1], 2);
    assert.equal(actual, expected, `flagsToModeFlagsAtIndex error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [1,1,0,1,0,1,0,1,1,0,1,0,];
    const actual = scaleLib.flagsToModeFlagsAtIndex([1,0,1,0,1,1,0,1,0,1,0,1], 4);
    assert.equal(actual, expected, `flagsToModeFlagsAtIndex error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [1,0,1,0,1,0,1,1,0,1,0,1];
    const actual = scaleLib.flagsToModeFlagsAtIndex([1,0,1,0,1,1,0,1,0,1,0,1], 5);
    assert.equal(actual, expected, `flagsToModeFlagsAtIndex error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [1,0,1,0,1,1,0,1,0,1,1,0];
    const actual = scaleLib.flagsToModeFlagsAtIndex([1,0,1,0,1,1,0,1,0,1,0,1], 7);
    assert.equal(actual, expected, `flagsToModeFlagsAtIndex error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [1,0,1,1,0,1,0,1,1,0,1,0];
    const actual = scaleLib.flagsToModeFlagsAtIndex([1,0,1,0,1,1,0,1,0,1,0,1], 9);
    assert.equal(actual, expected, `flagsToModeFlagsAtIndex error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [1,1,0,1,0,1,1,0,1,0,1,0];
    const actual = scaleLib.flagsToModeFlagsAtIndex([1,0,1,0,1,1,0,1,0,1,0,1], 11);
    assert.equal(actual, expected, `flagsToModeFlagsAtIndex error: actual ${actual}, expected ${expected}`);
  }
].forEach((tf) => test('should convert flags array to mode flags at index', tf));

[
  () => {
    const expected = [1,0,1,0,1,1,0,1,0,1,0,1];
    const actual = scaleLib.flagsToModeFlags([1,0,1,0,1,1,0,1,0,1,0,1], 0);
    assert.equal(actual, expected, `flagsToModeFlags error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [1,0,1,1,0,1,0,1,0,1,1,0];
    const actual = scaleLib.flagsToModeFlags([1,0,1,0,1,1,0,1,0,1,0,1], 1);
    assert.equal(actual, expected, `flagsToModeFlags error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [1,1,0,1,0,1,0,1,1,0,1,0];
    const actual = scaleLib.flagsToModeFlags([1,0,1,0,1,1,0,1,0,1,0,1], 2);
    assert.equal(actual, expected, `flagsToModeFlags error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [1,0,1,0,1,0,1,1,0,1,0,1];
    const actual = scaleLib.flagsToModeFlags([1,0,1,0,1,1,0,1,0,1,0,1], 3);
    assert.equal(actual, expected, `flagsToModeFlags error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [1,0,1,0,1,1,0,1,0,1,1,0];
    const actual = scaleLib.flagsToModeFlags([1,0,1,0,1,1,0,1,0,1,0,1], 4);
    assert.equal(actual, expected, `flagsToModeFlags error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [1,0,1,1,0,1,0,1,1,0,1,0];
    const actual = scaleLib.flagsToModeFlags([1,0,1,0,1,1,0,1,0,1,0,1], 5);
    assert.equal(actual, expected, `flagsToModeFlags error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [1,1,0,1,0,1,1,0,1,0,1,0];
    const actual = scaleLib.flagsToModeFlags([1,0,1,0,1,1,0,1,0,1,0,1], 6);
    assert.equal(actual, expected, `flagsToModeFlags error: actual ${actual}, expected ${expected}`);
  }
].forEach((tf) => test('should convert flags to mode flags', tf));

[
  () => {
    const expected = [2,2,1,2,2,2,1];
    const actual = scaleLib.flagsToIntervals([1,0,1,0,1,1,0,1,0,1,0,1]);
    assert.equal(actual, expected, `flagsToIntervals error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [2,2,1,2,2,2,1];
    const actual = scaleLib.flagsToIntervals([1,0,1,0,1,1,0,1,0,1,0,1]);
    assert.equal(actual, expected, `flagsToIntervals error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [2,1,2,2,2,1,2];
    const actual = scaleLib.flagsToIntervals([1,0,1,1,0,1,0,1,0,1,1,0]);
    assert.equal(actual, expected, `flagsToIntervals error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [1,2,2,2,1,2,2];
    const actual = scaleLib.flagsToIntervals([1,1,0,1,0,1,0,1,1,0,1,0]);
    assert.equal(actual, expected, `flagsToIntervals error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [2,2,2,1,2,2,1];
    const actual = scaleLib.flagsToIntervals([1,0,1,0,1,0,1,1,0,1,0,1]);
    assert.equal(actual, expected, `flagsToIntervals error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [2,2,1,2,2,1,2];
    const actual = scaleLib.flagsToIntervals([1,0,1,0,1,1,0,1,0,1,1,0]);
    assert.equal(actual, expected, `flagsToIntervals error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [2,1,2,2,1,2,2];
    const actual = scaleLib.flagsToIntervals([1,0,1,1,0,1,0,1,1,0,1,0]);
    assert.equal(actual, expected, `flagsToIntervals error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [1,2,2,1,2,2,2];
    const actual = scaleLib.flagsToIntervals([1,1,0,1,0,1,1,0,1,0,1,0]);
    assert.equal(actual, expected, `flagsToIntervals error: actual ${actual}, expected ${expected}`);
  }
].forEach((tf) => test('should convert flags array to intervals array', tf));

[
  () => {
    const expected = [0, 2, 4, 5, 7, 9, 11];
    const actual = scaleLib.flagsToOffsets([1,0,1,0,1,1,0,1,0,1,0,1]);
    assert.equal(actual, expected, `flagsToOffsets error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [0, 2, 3, 5, 7, 9, 10];
    const actual = scaleLib.flagsToOffsets([1,0,1,1,0,1,0,1,0,1,1,0]);
    assert.equal(actual, expected, `flagsToOffsets error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [0, 1, 3, 5, 7, 8, 10];
    const actual = scaleLib.flagsToOffsets([1,1,0,1,0,1,0,1,1,0,1,0]);
    assert.equal(actual, expected, `flagsToOffsets error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [0, 2, 4, 6, 7, 9, 11];
    const actual = scaleLib.flagsToOffsets([1,0,1,0,1,0,1,1,0,1,0,1]);
    assert.equal(actual, expected, `flagsToOffsets error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [0, 2, 4, 5, 7, 9, 10];
    const actual = scaleLib.flagsToOffsets([1,0,1,0,1,1,0,1,0,1,1,0]);
    assert.equal(actual, expected, `flagsToOffsets error: actual ${actual}, expected ${expected}`);
  },
  () =>
  {
    const expected = [0, 2, 3, 5, 7, 8, 10];
    const actual = scaleLib.flagsToOffsets([1,0,1,1,0,1,0,1,1,0,1,0]);
    assert.equal(actual, expected, `flagsToOffsets error: actual ${actual}, expected ${expected}`);
  },
  () =>
  {
    const expected = [0, 1, 3, 5, 6, 8, 10];
    const actual = scaleLib.flagsToOffsets([1,1,0,1,0,1,1,0,1,0,1,0]);
    assert.equal(actual, expected, `flagsToOffsets error: actual ${actual}, expected ${expected}`);
  }
].forEach((tf) => test('should convert flags array to offsets array', tf));

[
  () => {
    const input = ['a', 'b', 'c'];
    assert.throws(() => scaleLib.patternToFlags(input), undefined, `offsetsToIntervals expected error for input ${input}`);
  },
  () => {
    const input = [1, 1.2, 2];
    assert.throws(() => scaleLib.patternToFlags(input), undefined, `offsetsToIntervals expected error for input ${input}`);
  },
  () => {
    const input = null;
    assert.throws(() => scaleLib.patternToFlags(input), undefined, `offsetsToIntervals expected error for input ${input}`);
  },
  () => {
    const input = [[2, 2, 1, 2, 2, 2, 1], 'a'];
    assert.throws(() => scaleLib.patternToFlags(...input), undefined, `offsetsToIntervals expected error for input ${input}`);
  },
  () => {
    const expected = [2, 2, 1, 2, 2, 2, 1];
    const actual = scaleLib.offsetsToIntervals([0, 2, 4, 5, 7, 9, 11], 12);
    assert.equal(actual, expected, `offsetsToIntervals error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [2, 2, 1, 2, 2, 2];
    const actual = scaleLib.offsetsToIntervals([0, 2, 4, 5, 7, 9, 11]);
    assert.equal(actual, expected, `offsetsToIntervals error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [4, 3, 4];
    const actual = scaleLib.offsetsToIntervals([0, 4, 7, 11]);
    assert.equal(actual, expected, `offsetsToIntervals error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [3, 4, 3];
    const actual = scaleLib.offsetsToIntervals([0, 3, 7, 10]);
    assert.equal(actual, expected, `offsetsToIntervals error: actual ${actual}, expected ${expected}`);
  }
].forEach((tf) => test('should convert offsets array to intervals array', tf));

[
  () => {
    const expected = [0, 4, 7, 11];
    const actual = scaleLib.modeOffsetsToTetradOffsets([0, 2, 4, 5, 7, 9, 11]);
    assert.equal(actual, expected, `modeOffsetsToTetradOffsets error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [0, 3, 7, 10];
    const actual = scaleLib.modeOffsetsToTetradOffsets([0, 2, 3, 5, 7, 9, 10]);
    assert.equal(actual, expected, `modeOffsetsToTetradOffsets error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [0, 3, 7, 10];
    const actual = scaleLib.modeOffsetsToTetradOffsets([0, 1, 3, 5, 7, 8, 10]);
    assert.equal(actual, expected, `modeOffsetsToTetradOffsets error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [0, 4, 7, 11];
    const actual = scaleLib.modeOffsetsToTetradOffsets([0, 2, 4, 6, 7, 9, 11]);
    assert.equal(actual, expected, `modeOffsetsToTetradOffsets error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [0, 4, 7, 10];
    const actual = scaleLib.modeOffsetsToTetradOffsets([0, 2, 4, 5, 7, 9, 10]);
    assert.equal(actual, expected, `modeOffsetsToTetradOffsets error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [0, 3, 7, 10];
    const actual = scaleLib.modeOffsetsToTetradOffsets([0, 2, 3, 5, 7, 8, 10]);
    assert.equal(actual, expected, `modeOffsetsToTetradOffsets error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [0, 3, 6, 10];
    const actual = scaleLib.modeOffsetsToTetradOffsets([0, 1, 3, 5, 6, 8, 10]);
    assert.equal(actual, expected, `modeOffsetsToTetradOffsets error: actual ${actual}, expected ${expected}`);
  }
].forEach((tf) => test('should convert mode offsets array to tetrad offsets array', tf));

[
  () => {
    const expected = [0, 4, 7];
    const actual = scaleLib.tetradOffsetsToTriadOffsets([0, 4, 7, 11]);
    assert.equal(actual, expected, `tetradOffsetsToTriadOffsets error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [0, 3, 7];
    const actual = scaleLib.tetradOffsetsToTriadOffsets([0, 3, 7, 10]);
    assert.equal(actual, expected, `tetradOffsetsToTriadOffsets error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [0, 4, 7];
    const actual = scaleLib.tetradOffsetsToTriadOffsets([0, 4, 7, 10]);
    assert.equal(actual, expected, `tetradOffsetsToTriadOffsets error: actual ${actual}, expected ${expected}`);
  },
  () => {
    const expected = [0, 3, 6];
    const actual = scaleLib.tetradOffsetsToTriadOffsets([0, 3, 6, 10]);
    assert.equal(actual, expected, `tetradOffsetsToTriadOffsets error: actual ${actual}, expected ${expected}`);
  }
].forEach((tf) => test('should convert tetrad offsets array to triad offsets array', tf));

[
  () => {
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

    assert.is(actual.pattern, expectedPattern, `scale.pattern error: actual ${actual.pattern}, expected ${expectedPattern}`);
    assert.equal(actual.flags, expectedFlags, `scale.flags error: actual ${actual.flags}, expected ${expectedFlags}`);
    assert.is(actual.notes, expectedNotes, `scale.notes error: actual ${actual.notes}, expected ${expectedNotes}`);
    assert.is(actual.semitones, expectedSemitones, `scale.semitones error: actual ${actual.semitones}, expected ${expectedSemitones}`);
    assert.equal(actual.modesFlags[0], expectedMode0Flags, `scale.modesFlags[0] error: actual ${actual.modesFlags[0]}, expected ${expectedMode0Flags}`);
    assert.equal(actual.modesFlags[3], expectedMode3Flags, `scale.modesFlags[3] error: actual ${actual.modesFlags[3]}, expected ${expectedMode3Flags}`);
    assert.equal(actual.modesOffsets[0], expectedMode0Offsets, `scale.modesOffsets[0] error: actual ${actual.modesOffsets[0]}, expected ${expectedMode0Offsets}`);
    assert.equal(actual.modesOffsets[5], expectedMode5Offsets, `scale.modesOffsets[5] error: actual ${actual.modesOffsets[5]}, expected ${expectedMode5Offsets}`);
    assert.equal(actual.modesIntervals[0], expectedModes0Intervals, `scale.modesIntervals[0] error: actual ${actual.modesIntervals[0]}, expected ${expectedModes0Intervals}`);
    assert.equal(actual.modesIntervals[1], expectedModes1Intervals, `scale.modesIntervals[1] error: actual ${actual.modesIntervals[1]}, expected ${expectedModes1Intervals}`);
    assert.equal(actual.tetradsOffsets[0], expectedTetrads0Offsets, `scale.tetradsOffsets[0] error: actual ${actual.tetradsOffsets[0]}, expected ${expectedTetrads0Offsets}`);
    assert.equal(actual.tetradsOffsets[4], expectedTetrads4Offsets, `scale.tetradsOffsets[4] error: actual ${actual.tetradsOffsets[4]}, expected ${expectedTetrads4Offsets}`);
    assert.equal(actual.tetradsOffsets[6], expectedTetrads6Offsets, `scale.tetradsOffsets[6] error: actual ${actual.tetradsOffsets[6]}, expected ${expectedTetrads6Offsets}`);
    assert.equal(actual.tetradsIntervals[0], expectedTetrads0Intervals, `scale.tetradsIntervals[0] error: actual ${actual.tetradsIntervals[0]}, expected ${expectedTetrads0Intervals}`);
    assert.equal(actual.tetradsIntervals[4], expectedTetrads4Intervals, `scale.tetradsIntervals[4] error: actual ${actual.tetradsIntervals[4]}, expected ${expectedTetrads4Intervals}`);
    assert.equal(actual.tetradsIntervals[6], expectedTetrads6Intervals, `scale.tetradsIntervals[6] error: actual ${actual.tetradsIntervals[6]}, expected ${expectedTetrads6Intervals}`);
    assert.equal(actual.triadsOffsets[0], expectedTriads0Offsets, `scale.triadsOffsets[0] error: actual ${actual.triadsOffsets[0]}, expected ${expectedTriads0Offsets}`);
    assert.equal(actual.triadsOffsets[1], expectedTriads1Offsets, `scale.triadsOffsets[1] error: actual ${actual.triadsOffsets[1]}, expected ${expectedTriads1Offsets}`);
    assert.equal(actual.triadsOffsets[6], expectedTriads6Offsets, `scale.triadsOffsets[6] error: actual ${actual.triadsOffsets[6]}, expected ${expectedTriads6Offsets}`);
    assert.equal(actual.triadsIntervals[0], expectedTriads0Intervals, `scale.triadsIntervals[0] error: actual ${actual.triadsIntervals[0]}, expected ${expectedTriads0Intervals}`);
    assert.equal(actual.triadsIntervals[1], expectedTriads1Intervals, `scale.triadsIntervals[1] error: actual ${actual.triadsIntervals[1]}, expected ${expectedTriads1Intervals}`);
    assert.equal(actual.triadsIntervals[6], expectedTriads6Intervals, `scale.triadsIntervals[6] error: actual ${actual.triadsIntervals[6]}, expected ${expectedTriads6Intervals}`);
  },
  () => {
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

    assert.is(actual.pattern, expectedPattern, `scale.pattern error: actual ${actual.pattern}, expected ${expectedPattern}`);
    assert.equal(actual.flags, expectedFlags, `scale.flags error: actual ${actual.flags}, expected ${expectedFlags}`);
    assert.is(actual.notes, expectedNotes, `scale.notes error: actual ${actual.notes}, expected ${expectedNotes}`);
    assert.is(actual.semitones, expectedSemitones, `scale.semitones error: actual ${actual.semitones}, expected ${expectedSemitones}`);
    assert.equal(actual.modesFlags[0], expectedMode0Flags, `scale.modesFlags[0] error: actual ${actual.modesFlags[0]}, expected ${expectedMode0Flags}`);
    assert.equal(actual.modesFlags[3], expectedMode3Flags, `scale.modesFlags[3] error: actual ${actual.modesFlags[3]}, expected ${expectedMode3Flags}`);
    assert.equal(actual.modesOffsets[0], expectedMode0Offsets, `scale.modesOffsets[0] error: actual ${actual.modesOffsets[0]}, expected ${expectedMode0Offsets}`);
    assert.equal(actual.modesOffsets[5], expectedMode5Offsets, `scale.modesOffsets[5] error: actual ${actual.modesOffsets[5]}, expected ${expectedMode5Offsets}`);
    assert.equal(actual.modesIntervals[0], expectedModes0Intervals, `scale.modesIntervals[0] error: actual ${actual.modesIntervals[0]}, expected ${expectedModes0Intervals}`);
    assert.equal(actual.modesIntervals[1], expectedModes1Intervals, `scale.modesIntervals[1] error: actual ${actual.modesIntervals[1]}, expected ${expectedModes1Intervals}`);
    assert.equal(actual.tetradsOffsets[0], expectedTetrads0Offsets, `scale.tetradsOffsets[0] error: actual ${actual.tetradsOffsets[0]}, expected ${expectedTetrads0Offsets}`);
    assert.equal(actual.tetradsOffsets[4], expectedTetrads4Offsets, `scale.tetradsOffsets[4] error: actual ${actual.tetradsOffsets[4]}, expected ${expectedTetrads4Offsets}`);
    assert.equal(actual.tetradsOffsets[6], expectedTetrads6Offsets, `scale.tetradsOffsets[6] error: actual ${actual.tetradsOffsets[6]}, expected ${expectedTetrads6Offsets}`);
    assert.equal(actual.tetradsIntervals[0], expectedTetrads0Intervals, `scale.tetradsIntervals[0] error: actual ${actual.tetradsIntervals[0]}, expected ${expectedTetrads0Intervals}`);
    assert.equal(actual.tetradsIntervals[4], expectedTetrads4Intervals, `scale.tetradsIntervals[4] error: actual ${actual.tetradsIntervals[4]}, expected ${expectedTetrads4Intervals}`);
    assert.equal(actual.tetradsIntervals[6], expectedTetrads6Intervals, `scale.tetradsIntervals[6] error: actual ${actual.tetradsIntervals[6]}, expected ${expectedTetrads6Intervals}`);
    assert.equal(actual.triadsOffsets[0], expectedTriads0Offsets, `scale.triadsOffsets[0] error: actual ${actual.triadsOffsets[0]}, expected ${expectedTriads0Offsets}`);
    assert.equal(actual.triadsOffsets[1], expectedTriads1Offsets, `scale.triadsOffsets[1] error: actual ${actual.triadsOffsets[1]}, expected ${expectedTriads1Offsets}`);
    assert.equal(actual.triadsOffsets[6], expectedTriads6Offsets, `scale.triadsOffsets[6] error: actual ${actual.triadsOffsets[6]}, expected ${expectedTriads6Offsets}`);
    assert.equal(actual.triadsIntervals[0], expectedTriads0Intervals, `scale.triadsIntervals[0] error: actual ${actual.triadsIntervals[0]}, expected ${expectedTriads0Intervals}`);
    assert.equal(actual.triadsIntervals[1], expectedTriads1Intervals, `scale.triadsIntervals[1] error: actual ${actual.triadsIntervals[1]}, expected ${expectedTriads1Intervals}`);
    assert.equal(actual.triadsIntervals[6], expectedTriads6Intervals, `scale.triadsIntervals[6] error: actual ${actual.triadsIntervals[6]}, expected ${expectedTriads6Intervals}`);
  }
].forEach((tf) => test('should construct scale with fields', tf));

test.run();
