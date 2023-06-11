import {SCALES} from "./glossary.js";
import {AllowedIndexes} from "./util.js";
import {initPlayer} from "./player.js";
import {Conductor, defaultChangeCallback} from "./conductor.js";
import {Composer} from "./composer.js";
import riffRhythmDrums from "./riffer-rhythm-drums.js";
import riffRhythmBassGuitar from "./riffer-rhythm-bass-guitar.js";
import riffRhythmGuitar from "./riffer-rhythm-guitar.js";
import {LeadRiffer, defaultQueueCallback as defaultLeadRifferQueueCallback} from "./riffer-lead.js";

const defaultComposer = Composer(SCALES);
const defaultAllowedScaleIndexes = AllowedIndexes(SCALES.length);

export default (
    audioContext,
    allowedScaleIndexes = defaultAllowedScaleIndexes,
    leadRifferQueueCallback = defaultLeadRifferQueueCallback,
    conductorChangeCallback = defaultChangeCallback
) => {
  return initPlayer(audioContext)
      .then((player) => {
        const leadRiffer = LeadRiffer(leadRifferQueueCallback);
        const riffers = [riffRhythmDrums, riffRhythmBassGuitar, riffRhythmGuitar, leadRiffer.riffLead];
        const conductor = Conductor(player, riffers, defaultComposer, allowedScaleIndexes, conductorChangeCallback);
        return Promise.resolve(conductor);
      });
};
