import {PRESET_NAME_GUITAR_BASS, Riff} from "./player.js";
import {CHORD_TYPE_TETRAD} from "./scale.js";
import {randomChoice, randomChance} from "./util.js";
import {BAR_LENGTH_SECS, NOTE_LENGTH_SECS} from "./conductor.js";


export default (composer, player, when, bars) => {
  const riff = Riff();
  const queueBass = (whenOffset, pitch, duration) => {
    riff.addStrike(PRESET_NAME_GUITAR_BASS, when + whenOffset, pitch, duration, 0.75);
  };

  const {chordOffsets, octave, chordKeyIndex} = composer;

  const addedNoteArr = composer.chordType === CHORD_TYPE_TETRAD ?
      [chordOffsets[1], chordOffsets[2], chordOffsets[3], 0, chordOffsets[1], chordOffsets[2], chordOffsets[3]] :
      [chordOffsets[1], chordOffsets[2], 0, chordOffsets[1], chordOffsets[2]];

  queueBass(0, ((octave - 1) * 12) + chordKeyIndex, NOTE_LENGTH_SECS / 2);
  queueBass((NOTE_LENGTH_SECS / 4), ((octave - 1) * 12) + chordKeyIndex + randomChoice(addedNoteArr), NOTE_LENGTH_SECS / 2);
  if (randomChance(3)) {
    queueBass(NOTE_LENGTH_SECS / 2, ((octave) * 12) + chordKeyIndex, 0.3);
  }
  queueBass((BAR_LENGTH_SECS / 2), ((octave - 1) * 12) + chordKeyIndex, 0.3);
  queueBass((BAR_LENGTH_SECS / 2) + (NOTE_LENGTH_SECS / 4), ((octave - 1) * 12) + chordKeyIndex, 0.3);
  queueBass((BAR_LENGTH_SECS / 2) + (NOTE_LENGTH_SECS / 4), ((octave - 1) * 12) + chordKeyIndex + randomChoice(addedNoteArr), 0.3);
  if (randomChance(3)) {
    if (randomChance(2)) {
      queueBass((BAR_LENGTH_SECS / 2) + (NOTE_LENGTH_SECS / 2), ((octave) * 12) + chordKeyIndex, 0.3);
    }
    else {
      queueBass((BAR_LENGTH_SECS / 2) + (NOTE_LENGTH_SECS / 2), ((octave) * 12) + chordKeyIndex + randomChoice(addedNoteArr), 0.3);
    }
  }
  return riff;
};
