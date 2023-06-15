import * as scaleLib from '../scale.js';
import {test} from 'uvu';
import * as assert from 'uvu/assert';


test('should convert pattern string to flags array', () => {
  {
    const input = '8970807023';
    assert.throws(() => scaleLib.patternToFlags(input), undefined, `patternToFlags expected error for input ${input}`);
  }
  {
    const input = 101011010101;
    assert.throws(() => scaleLib.patternToFlags(input), undefined, `patternToFlags expected error for input ${input}`);
  }
  {
    const input = '101011010100';
    assert.throws(() => scaleLib.patternToFlags(input), undefined, `patternToFlags expected error for input ${input}`);
  }
  {
    const input = '10101101011';
    assert.throws(() => scaleLib.patternToFlags(input), undefined, `patternToFlags expected error for input ${input}`);
  }
  {
    const input = [1, 1, 1, 1, 1, 0];
    assert.throws(() => scaleLib.patternToFlags(input), undefined, `patternToFlags expected error for input ${input}`);
  }
  {
    const expected = [1,0,1,0,1,1,0,1,0,1,0,1];
    const actual = scaleLib.patternToFlags('101011010101');
    assert.equal(actual, expected, `patternToFlags error: expected ${expected}, actual ${actual}`);
  }

});

test("should convert flags array to mode flags at index", () => {
  {
    const expected = [1,0,1,0,1,1,0,1,0,1,0,1];
    const actual = scaleLib.flagsToModeFlagsAtIndex([1,0,1,0,1,1,0,1,0,1,0,1], 0);
    assert.equal(actual, expected, `flagsToModeFlagsAtIndex error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [1,0,1,1,0,1,0,1,0,1,1,0];
    const actual = scaleLib.flagsToModeFlagsAtIndex([1,0,1,0,1,1,0,1,0,1,0,1], 2);
    assert.equal(actual, expected, `flagsToModeFlagsAtIndex error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [1,1,0,1,0,1,0,1,1,0,1,0,];
    const actual = scaleLib.flagsToModeFlagsAtIndex([1,0,1,0,1,1,0,1,0,1,0,1], 4);
    assert.equal(actual, expected, `flagsToModeFlagsAtIndex error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [1,0,1,0,1,0,1,1,0,1,0,1];
    const actual = scaleLib.flagsToModeFlagsAtIndex([1,0,1,0,1,1,0,1,0,1,0,1], 5);
    assert.equal(actual, expected, `flagsToModeFlagsAtIndex error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [1,0,1,0,1,1,0,1,0,1,1,0];
    const actual = scaleLib.flagsToModeFlagsAtIndex([1,0,1,0,1,1,0,1,0,1,0,1], 7);
    assert.equal(actual, expected, `flagsToModeFlagsAtIndex error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [1,0,1,1,0,1,0,1,1,0,1,0];
    const actual = scaleLib.flagsToModeFlagsAtIndex([1,0,1,0,1,1,0,1,0,1,0,1], 9);
    assert.equal(actual, expected, `flagsToModeFlagsAtIndex error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [1,1,0,1,0,1,1,0,1,0,1,0];
    const actual = scaleLib.flagsToModeFlagsAtIndex([1,0,1,0,1,1,0,1,0,1,0,1], 11);
    assert.equal(actual, expected, `flagsToModeFlagsAtIndex error: expected ${expected}, actual ${actual}`);
  }
});

test("should convert flags to mode flags", () => {
  {
    const expected = [1,0,1,0,1,1,0,1,0,1,0,1];
    const actual = scaleLib.flagsToModeFlags([1,0,1,0,1,1,0,1,0,1,0,1], 0);
    assert.equal(actual, expected, `flagsToModeFlags error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [1,0,1,1,0,1,0,1,0,1,1,0];
    const actual = scaleLib.flagsToModeFlags([1,0,1,0,1,1,0,1,0,1,0,1], 1);
    assert.equal(actual, expected, `flagsToModeFlags error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [1,1,0,1,0,1,0,1,1,0,1,0];
    const actual = scaleLib.flagsToModeFlags([1,0,1,0,1,1,0,1,0,1,0,1], 2);
    assert.equal(actual, expected, `flagsToModeFlags error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [1,0,1,0,1,0,1,1,0,1,0,1];
    const actual = scaleLib.flagsToModeFlags([1,0,1,0,1,1,0,1,0,1,0,1], 3);
    assert.equal(actual, expected, `flagsToModeFlags error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [1,0,1,0,1,1,0,1,0,1,1,0];
    const actual = scaleLib.flagsToModeFlags([1,0,1,0,1,1,0,1,0,1,0,1], 4);
    assert.equal(actual, expected, `flagsToModeFlags error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [1,0,1,1,0,1,0,1,1,0,1,0];
    const actual = scaleLib.flagsToModeFlags([1,0,1,0,1,1,0,1,0,1,0,1], 5);
    assert.equal(actual, expected, `flagsToModeFlags error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [1,1,0,1,0,1,1,0,1,0,1,0];
    const actual = scaleLib.flagsToModeFlags([1,0,1,0,1,1,0,1,0,1,0,1], 6);
    assert.equal(actual, expected, `flagsToModeFlags error: expected ${expected}, actual ${actual}`);
  }
});

test("should convert flags array to intervals array", () => {
  {
    const expected = [2,2,1,2,2,2,1];
    const actual = scaleLib.flagsToIntervals([1,0,1,0,1,1,0,1,0,1,0,1]);
    assert.equal(actual, expected, `flagsToIntervals error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [2,2,1,2,2,2,1];
    const actual = scaleLib.flagsToIntervals([1,0,1,0,1,1,0,1,0,1,0,1]);
    assert.equal(actual, expected, `flagsToIntervals error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [2,1,2,2,2,1,2];
    const actual = scaleLib.flagsToIntervals([1,0,1,1,0,1,0,1,0,1,1,0]);
    assert.equal(actual, expected, `flagsToIntervals error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [1,2,2,2,1,2,2];
    const actual = scaleLib.flagsToIntervals([1,1,0,1,0,1,0,1,1,0,1,0]);
    assert.equal(actual, expected, `flagsToIntervals error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [2,2,2,1,2,2,1];
    const actual = scaleLib.flagsToIntervals([1,0,1,0,1,0,1,1,0,1,0,1]);
    assert.equal(actual, expected, `flagsToIntervals error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [2,2,1,2,2,1,2];
    const actual = scaleLib.flagsToIntervals([1,0,1,0,1,1,0,1,0,1,1,0]);
    assert.equal(actual, expected, `flagsToIntervals error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [2,1,2,2,1,2,2];
    const actual = scaleLib.flagsToIntervals([1,0,1,1,0,1,0,1,1,0,1,0]);
    assert.equal(actual, expected, `flagsToIntervals error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [1,2,2,1,2,2,2];
    const actual = scaleLib.flagsToIntervals([1,1,0,1,0,1,1,0,1,0,1,0]);
    assert.equal(actual, expected, `flagsToIntervals error: expected ${expected}, actual ${actual}`);
  }

});

test("should convert flags array to offsets array", () => {
  {
    const expected = [0, 2, 4, 5, 7, 9, 11];
    const actual = scaleLib.flagsToOffsets([1,0,1,0,1,1,0,1,0,1,0,1]);
    assert.equal(actual, expected, `flagsToOffsets error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [0, 2, 3, 5, 7, 9, 10];
    const actual = scaleLib.flagsToOffsets([1,0,1,1,0,1,0,1,0,1,1,0]);
    assert.equal(actual, expected, `flagsToOffsets error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [0, 1, 3, 5, 7, 8, 10];
    const actual = scaleLib.flagsToOffsets([1,1,0,1,0,1,0,1,1,0,1,0]);
    assert.equal(actual, expected, `flagsToOffsets error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [0, 2, 4, 6, 7, 9, 11];
    const actual = scaleLib.flagsToOffsets([1,0,1,0,1,0,1,1,0,1,0,1]);
    assert.equal(actual, expected, `flagsToOffsets error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [0, 2, 4, 5, 7, 9, 10];
    const actual = scaleLib.flagsToOffsets([1,0,1,0,1,1,0,1,0,1,1,0]);
    assert.equal(actual, expected, `flagsToOffsets error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [0, 2, 3, 5, 7, 8, 10];
    const actual = scaleLib.flagsToOffsets([1,0,1,1,0,1,0,1,1,0,1,0]);
    assert.equal(actual, expected, `flagsToOffsets error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [0, 1, 3, 5, 6, 8, 10];
    const actual = scaleLib.flagsToOffsets([1,1,0,1,0,1,1,0,1,0,1,0]);
    assert.equal(actual, expected, `flagsToOffsets error: expected ${expected}, actual ${actual}`);
  }
});

test("should convert offsets array to intervals array", () => {
  {
    const input = ['a', 'b', 'c'];
    assert.throws(() => scaleLib.patternToFlags(input), undefined, `offsetsToIntervals expected error for input ${input}`);
  }
  {
    const input = [1, 1.2, 2];
    assert.throws(() => scaleLib.patternToFlags(input), undefined, `offsetsToIntervals expected error for input ${input}`);
  }
  {
    const input = null;
    assert.throws(() => scaleLib.patternToFlags(input), undefined, `offsetsToIntervals expected error for input ${input}`);
  }
  {
    const input = [[2, 2, 1, 2, 2, 2, 1], 'a'];
    assert.throws(() => scaleLib.patternToFlags(...input), undefined, `offsetsToIntervals expected error for input ${input}`);
  }
  {
    const expected = [2, 2, 1, 2, 2, 2, 1];
    const actual = scaleLib.offsetsToIntervals([0, 2, 4, 5, 7, 9, 11], 12);
    assert.equal(actual, expected, `offsetsToIntervals error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [2, 2, 1, 2, 2, 2];
    const actual = scaleLib.offsetsToIntervals([0, 2, 4, 5, 7, 9, 11]);
    assert.equal(actual, expected, `offsetsToIntervals error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [4, 3, 4];
    const actual = scaleLib.offsetsToIntervals([0, 4, 7, 11]);
    assert.equal(actual, expected, `offsetsToIntervals error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [3, 4, 3];
    const actual = scaleLib.offsetsToIntervals([0, 3, 7, 10]);
    assert.equal(actual, expected, `offsetsToIntervals error: expected ${expected}, actual ${actual}`);
  }
});

test("should convert mode offsets array to tetrad offsets array", () => {
  {
    const expected = [0, 4, 7, 11];
    const actual = scaleLib.modeOffsetsToTetradOffsets([0, 2, 4, 5, 7, 9, 11]);
    assert.equal(actual, expected, `modeOffsetsToTetradOffsets error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [0, 3, 7, 10];
    const actual = scaleLib.modeOffsetsToTetradOffsets([0, 2, 3, 5, 7, 9, 10]);
    assert.equal(actual, expected, `modeOffsetsToTetradOffsets error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [0, 3, 7, 10];
    const actual = scaleLib.modeOffsetsToTetradOffsets([0, 1, 3, 5, 7, 8, 10]);
    assert.equal(actual, expected, `modeOffsetsToTetradOffsets error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [0, 4, 7, 11];
    const actual = scaleLib.modeOffsetsToTetradOffsets([0, 2, 4, 6, 7, 9, 11]);
    assert.equal(actual, expected, `modeOffsetsToTetradOffsets error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [0, 4, 7, 10];
    const actual = scaleLib.modeOffsetsToTetradOffsets([0, 2, 4, 5, 7, 9, 10]);
    assert.equal(actual, expected, `modeOffsetsToTetradOffsets error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [0, 3, 7, 10];
    const actual = scaleLib.modeOffsetsToTetradOffsets([0, 2, 3, 5, 7, 8, 10]);
    assert.equal(actual, expected, `modeOffsetsToTetradOffsets error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [0, 3, 6, 10];
    const actual = scaleLib.modeOffsetsToTetradOffsets([0, 1, 3, 5, 6, 8, 10]);
    assert.equal(actual, expected, `modeOffsetsToTetradOffsets error: expected ${expected}, actual ${actual}`);
  }
});

test("should convert tetrad offsets array to triad offsets array", () => {
  {
    const expected = [0, 4, 7];
    const actual = scaleLib.tetradOffsetsToTriadOffsets([0, 4, 7, 11]);
    assert.equal(actual, expected, `tetradOffsetsToTriadOffsets error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [0, 3, 7];
    const actual = scaleLib.tetradOffsetsToTriadOffsets([0, 3, 7, 10]);
    assert.equal(actual, expected, `tetradOffsetsToTriadOffsets error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [0, 4, 7];
    const actual = scaleLib.tetradOffsetsToTriadOffsets([0, 4, 7, 10]);
    assert.equal(actual, expected, `tetradOffsetsToTriadOffsets error: expected ${expected}, actual ${actual}`);
  }
  {
    const expected = [0, 3, 6];
    const actual = scaleLib.tetradOffsetsToTriadOffsets([0, 3, 6, 10]);
    assert.equal(actual, expected, `tetradOffsetsToTriadOffsets error: expected ${expected}, actual ${actual}`);
  }

});

test("should construct scale with fields", () => {
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

    assert.is(actual.pattern, expectedPattern, `scale.pattern error: expected ${expectedPattern}, actual ${actual.pattern}`);
    assert.equal(actual.flags, expectedFlags, `scale.flags error: expected ${expectedFlags}, actual ${actual.flags}`);
    assert.is(actual.notes, expectedNotes, `scale.notes error: expected ${expectedNotes}, actual ${actual.notes}`);
    assert.is(actual.semitones, expectedSemitones, `scale.semitones error: expected ${expectedSemitones}, actual ${actual.semitones}`);
    assert.equal(actual.modesFlags[0], expectedMode0Flags, `scale.modesFlags[0] error: expected ${expectedMode0Flags}, actual ${actual.modesFlags[0]}`);
    assert.equal(actual.modesFlags[3], expectedMode3Flags, `scale.modesFlags[3] error: expected ${expectedMode3Flags}, actual ${actual.modesFlags[3]}`);
    assert.equal(actual.modesOffsets[0], expectedMode0Offsets, `scale.modesOffsets[0] error: expected ${expectedMode0Offsets}, actual ${actual.modesOffsets[0]}`);
    assert.equal(actual.modesOffsets[5], expectedMode5Offsets, `scale.modesOffsets[5] error: expected ${expectedMode5Offsets}, actual ${actual.modesOffsets[5]}`);
    assert.equal(actual.modesIntervals[0], expectedModes0Intervals, `scale.modesIntervals[0] error: expected ${expectedModes0Intervals}, actual ${actual.modesIntervals[0]}`);
    assert.equal(actual.modesIntervals[1], expectedModes1Intervals, `scale.modesIntervals[1] error: expected ${expectedModes1Intervals}, actual ${actual.modesIntervals[1]}`);
    assert.equal(actual.tetradsOffsets[0], expectedTetrads0Offsets, `scale.tetradsOffsets[0] error: expected ${expectedTetrads0Offsets}, actual ${actual.tetradsOffsets[0]}`);
    assert.equal(actual.tetradsOffsets[4], expectedTetrads4Offsets, `scale.tetradsOffsets[4] error: expected ${expectedTetrads4Offsets}, actual ${actual.tetradsOffsets[4]}`);
    assert.equal(actual.tetradsOffsets[6], expectedTetrads6Offsets, `scale.tetradsOffsets[6] error: expected ${expectedTetrads6Offsets}, actual ${actual.tetradsOffsets[6]}`);
    assert.equal(actual.tetradsIntervals[0], expectedTetrads0Intervals, `scale.tetradsIntervals[0] error: expected ${expectedTetrads0Intervals}, actual ${actual.tetradsIntervals[0]}`);
    assert.equal(actual.tetradsIntervals[4], expectedTetrads4Intervals, `scale.tetradsIntervals[4] error: expected ${expectedTetrads4Intervals}, actual ${actual.tetradsIntervals[4]}`);
    assert.equal(actual.tetradsIntervals[6], expectedTetrads6Intervals, `scale.tetradsIntervals[6] error: expected ${expectedTetrads6Intervals}, actual ${actual.tetradsIntervals[6]}`);
    assert.equal(actual.triadsOffsets[0], expectedTriads0Offsets, `scale.triadsOffsets[0] error: expected ${expectedTriads0Offsets}, actual ${actual.triadsOffsets[0]}`);
    assert.equal(actual.triadsOffsets[1], expectedTriads1Offsets, `scale.triadsOffsets[1] error: expected ${expectedTriads1Offsets}, actual ${actual.triadsOffsets[1]}`);
    assert.equal(actual.triadsOffsets[6], expectedTriads6Offsets, `scale.triadsOffsets[6] error: expected ${expectedTriads6Offsets}, actual ${actual.triadsOffsets[6]}`);
    assert.equal(actual.triadsIntervals[0], expectedTriads0Intervals, `scale.triadsIntervals[0] error: expected ${expectedTriads0Intervals}, actual ${actual.triadsIntervals[0]}`);
    assert.equal(actual.triadsIntervals[1], expectedTriads1Intervals, `scale.triadsIntervals[1] error: expected ${expectedTriads1Intervals}, actual ${actual.triadsIntervals[1]}`);
    assert.equal(actual.triadsIntervals[6], expectedTriads6Intervals, `scale.triadsIntervals[6] error: expected ${expectedTriads6Intervals}, actual ${actual.triadsIntervals[6]}`);
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

    assert.is(actual.pattern, expectedPattern, `scale.pattern error: expected ${expectedPattern}, actual ${actual.pattern}`);
    assert.equal(actual.flags, expectedFlags, `scale.flags error: expected ${expectedFlags}, actual ${actual.flags}`);
    assert.is(actual.notes, expectedNotes, `scale.notes error: expected ${expectedNotes}, actual ${actual.notes}`);
    assert.is(actual.semitones, expectedSemitones, `scale.semitones error: expected ${expectedSemitones}, actual ${actual.semitones}`);
    assert.equal(actual.modesFlags[0], expectedMode0Flags, `scale.modesFlags[0] error: expected ${expectedMode0Flags}, actual ${actual.modesFlags[0]}`);
    assert.equal(actual.modesFlags[3], expectedMode3Flags, `scale.modesFlags[3] error: expected ${expectedMode3Flags}, actual ${actual.modesFlags[3]}`);
    assert.equal(actual.modesOffsets[0], expectedMode0Offsets, `scale.modesOffsets[0] error: expected ${expectedMode0Offsets}, actual ${actual.modesOffsets[0]}`);
    assert.equal(actual.modesOffsets[5], expectedMode5Offsets, `scale.modesOffsets[5] error: expected ${expectedMode5Offsets}, actual ${actual.modesOffsets[5]}`);
    assert.equal(actual.modesIntervals[0], expectedModes0Intervals, `scale.modesIntervals[0] error: expected ${expectedModes0Intervals}, actual ${actual.modesIntervals[0]}`);
    assert.equal(actual.modesIntervals[1], expectedModes1Intervals, `scale.modesIntervals[1] error: expected ${expectedModes1Intervals}, actual ${actual.modesIntervals[1]}`);
    assert.equal(actual.tetradsOffsets[0], expectedTetrads0Offsets, `scale.tetradsOffsets[0] error: expected ${expectedTetrads0Offsets}, actual ${actual.tetradsOffsets[0]}`);
    assert.equal(actual.tetradsOffsets[4], expectedTetrads4Offsets, `scale.tetradsOffsets[4] error: expected ${expectedTetrads4Offsets}, actual ${actual.tetradsOffsets[4]}`);
    assert.equal(actual.tetradsOffsets[6], expectedTetrads6Offsets, `scale.tetradsOffsets[6] error: expected ${expectedTetrads6Offsets}, actual ${actual.tetradsOffsets[6]}`);
    assert.equal(actual.tetradsIntervals[0], expectedTetrads0Intervals, `scale.tetradsIntervals[0] error: expected ${expectedTetrads0Intervals}, actual ${actual.tetradsIntervals[0]}`);
    assert.equal(actual.tetradsIntervals[4], expectedTetrads4Intervals, `scale.tetradsIntervals[4] error: expected ${expectedTetrads4Intervals}, actual ${actual.tetradsIntervals[4]}`);
    assert.equal(actual.tetradsIntervals[6], expectedTetrads6Intervals, `scale.tetradsIntervals[6] error: expected ${expectedTetrads6Intervals}, actual ${actual.tetradsIntervals[6]}`);
    assert.equal(actual.triadsOffsets[0], expectedTriads0Offsets, `scale.triadsOffsets[0] error: expected ${expectedTriads0Offsets}, actual ${actual.triadsOffsets[0]}`);
    assert.equal(actual.triadsOffsets[1], expectedTriads1Offsets, `scale.triadsOffsets[1] error: expected ${expectedTriads1Offsets}, actual ${actual.triadsOffsets[1]}`);
    assert.equal(actual.triadsOffsets[6], expectedTriads6Offsets, `scale.triadsOffsets[6] error: expected ${expectedTriads6Offsets}, actual ${actual.triadsOffsets[6]}`);
    assert.equal(actual.triadsIntervals[0], expectedTriads0Intervals, `scale.triadsIntervals[0] error: expected ${expectedTriads0Intervals}, actual ${actual.triadsIntervals[0]}`);
    assert.equal(actual.triadsIntervals[1], expectedTriads1Intervals, `scale.triadsIntervals[1] error: expected ${expectedTriads1Intervals}, actual ${actual.triadsIntervals[1]}`);
    assert.equal(actual.triadsIntervals[6], expectedTriads6Intervals, `scale.triadsIntervals[6] error: expected ${expectedTriads6Intervals}, actual ${actual.triadsIntervals[6]}`);
  }

});

test.run();
