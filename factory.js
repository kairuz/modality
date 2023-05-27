import {Player} from "./player.js";
import {Conductor, defaultChangeCallback} from "./conductor.js";
import riffRhythmDrums from "./riff-rhythm-drums.js";
import riffRhythmBassGuitar from "./riff-rhythm-bass-guitar.js";
import riffRhythmGuitar from "./riff-rhythm-guitar.js";
import {LeadRiffer, defaultQueueCallback as defaultLeadRifferQueueCallback} from "./riff-lead.js";


export default (
    audioContext,
    leadRifferQueueCallback = defaultLeadRifferQueueCallback,
    conductorChangeCallback = defaultChangeCallback
) => {
  const player = Player(audioContext);
  const leadRiffer = LeadRiffer(leadRifferQueueCallback);
  const barRiffs = [riffRhythmDrums, riffRhythmGuitar, riffRhythmBassGuitar, leadRiffer.riff];
  const conductor = Conductor(player, barRiffs, conductorChangeCallback);

  return conductor;
};
