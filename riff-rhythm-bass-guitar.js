import * as playerLib from "./player.js";
import * as domain from "./domain.js";
import * as util from "./util.js";
import {BAR_LENGTH_SECS, NOTE_LENGTH_SECS} from "./conductor.js";


export default (composer, player, when, bars) => {
  const queueBass = (whenOffset, pitch, duration) => {
    player.play(playerLib.PRESET_NAME_GUITAR_BASS, when + whenOffset, duration, pitch, 0.75);
  };

  const {chordOffsets, octave, chordKeyIndex} = composer;

  const addedNoteArr = composer.chordType === domain.CHORD_TYPE_TETRAD ?
      [chordOffsets[1], chordOffsets[2], chordOffsets[3], 0, chordOffsets[1], chordOffsets[2], chordOffsets[3]] :
      [chordOffsets[1], chordOffsets[2], 0, chordOffsets[1], chordOffsets[2]];

  queueBass(0, ((octave - 1) * 12) + chordKeyIndex, NOTE_LENGTH_SECS / 2);
  queueBass((NOTE_LENGTH_SECS / 4), ((octave - 1) * 12) + chordKeyIndex + util.randomChoice(addedNoteArr), NOTE_LENGTH_SECS / 2);
  if (util.randomChance(3)) {
    queueBass(NOTE_LENGTH_SECS / 2, ((octave) * 12) + chordKeyIndex, 0.3);
  }
  queueBass((BAR_LENGTH_SECS / 2), ((octave - 1) * 12) + chordKeyIndex, 0.3);
  queueBass((BAR_LENGTH_SECS / 2) + (NOTE_LENGTH_SECS / 4), ((octave - 1) * 12) + chordKeyIndex, 0.3);
  queueBass((BAR_LENGTH_SECS / 2) + (NOTE_LENGTH_SECS / 4), ((octave - 1) * 12) + chordKeyIndex + util.randomChoice(addedNoteArr), 0.3);
  if (util.randomChance(3)) {
    if (util.randomChance(2)) {
      queueBass((BAR_LENGTH_SECS / 2) + (NOTE_LENGTH_SECS / 2), ((octave) * 12) + chordKeyIndex, 0.3);
    }
    else {
      queueBass((BAR_LENGTH_SECS / 2) + (NOTE_LENGTH_SECS / 2), ((octave) * 12) + chordKeyIndex + util.randomChoice(addedNoteArr), 0.3);
    }
  }
};
