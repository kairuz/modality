import {Player} from "./player.js";
import {Conductor, defaultChangeCallback as conductorChangeCallback} from "./conductor.js";
import riffRhythmDrums from "./riff-rhythm-drums.js";
import riffRhythmBassGuitar from "./riff-rhythm-bass-guitar.js";
import riffRhythmGuitar from "./riff-rhythm-guitar.js";
import {LeadRiffer, defaultQueueCallback as leadRifferQueueCallback} from "./riff-lead.js";


export default (
    audioContext,
    leadRifferQueueCallback = leadRifferQueueCallback,
    conductorChangeCallback = conductorChangeCallback
) => {
  const player = Player(audioContext);
  const leadRiffer = LeadRiffer(leadRifferQueueCallback);
  const barRiffs = [riffRhythmDrums, riffRhythmGuitar, riffRhythmBassGuitar, leadRiffer.riff];
  const conductor = Conductor(player, barRiffs, conductorChangeCallback);

  return conductor;
};
