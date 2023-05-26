import WebAudioFontPlayer from "https://kairuz.github.io/webaudiofont/npm/dist/player.js";
import * as util from "./util.js";


const STRUM_DIRECTION_DOWN = 0;
const STRUM_DIRECTION_UP = 1;

const PRESET_NAME_PIANO = 'piano';
const PRESET_NAME_GUITAR_NYLON = 'guitar-nylon';
const PRESET_NAME_GUITAR_STEEL = 'guitar-steel';
const PRESET_NAME_GUITAR_ELECTRIC_JAZZ = 'guitar-electric-jazz';
const PRESET_NAME_GUITAR_ELECTRIC_OVERDRIVE = 'guitar-electric-overdrive';
const PRESET_NAME_GUITAR_BASS = 'guitar-bass';
const PRESET_NAME_DRUMS_KICK = 'drums-kick';
const PRESET_NAME_DRUMS_SNARE = 'drums-snare';
const PRESET_NAME_DRUMS_CRASH = 'drums-crash';
const PRESET_NAME_DRUMS_HIHAT = 'drums-hihat';
const PRESET_NAME_DRUMS_HIHAT_OPEN = 'drums-hihat_open';
const PRESET_NAMES = Object.freeze([PRESET_NAME_PIANO, PRESET_NAME_GUITAR_NYLON, PRESET_NAME_GUITAR_STEEL,
                                    PRESET_NAME_GUITAR_ELECTRIC_OVERDRIVE, PRESET_NAME_GUITAR_ELECTRIC_JAZZ, PRESET_NAME_GUITAR_BASS,
                                    PRESET_NAME_DRUMS_KICK, PRESET_NAME_DRUMS_SNARE,
                                    PRESET_NAME_DRUMS_CRASH, PRESET_NAME_DRUMS_HIHAT, PRESET_NAME_DRUMS_HIHAT_OPEN]);

const webAudioFontPresetPathsAndVarNames = Object.freeze([
  ['https://surikov.github.io/webaudiofontdata/sound/0000_JCLive_sf2_file.js',            '_tone_0000_JCLive_sf2_file'],            // piano
  ['https://surikov.github.io/webaudiofontdata/sound/0253_Acoustic_Guitar_sf2_file.js',   '_tone_0253_Acoustic_Guitar_sf2_file'],   // guitar nylon
  ['https://surikov.github.io/webaudiofontdata/sound/0250_LK_AcousticSteel_SF2_file.js',  '_tone_0250_LK_AcousticSteel_SF2_file'],  // guitar steel
  ['https://surikov.github.io/webaudiofontdata/sound/0260_SoundBlasterOld_sf2.js',        '_tone_0260_SoundBlasterOld_sf2'],        // guitar electric jazz
  ['https://surikov.github.io/webaudiofontdata/sound/0290_SoundBlasterOld_sf2.js',        '_tone_0290_SoundBlasterOld_sf2'],        // guitar electric overdrive
  ['https://surikov.github.io/webaudiofontdata/sound/0330_Aspirin_sf2_file.js',           '_tone_0330_Aspirin_sf2_file'],           // guitar bass
  ['https://surikov.github.io/webaudiofontdata/sound/12836_11_Chaos_sf2_file.js',         '_drum_36_11_Chaos_sf2_file'],            // drums-kick
  ['https://surikov.github.io/webaudiofontdata/sound/12840_11_Chaos_sf2_file.js',         '_drum_40_11_Chaos_sf2_file'],            // drums-snare
  ['https://surikov.github.io/webaudiofontdata/sound/12849_11_Chaos_sf2_file.js',         '_drum_49_11_Chaos_sf2_file'],            // drums-crash
  ['https://surikov.github.io/webaudiofontdata/sound/12842_11_Chaos_sf2_file.js',         '_drum_42_11_Chaos_sf2_file'],            // drums-hihat
  ['https://surikov.github.io/webaudiofontdata/sound/12846_11_Chaos_sf2_file.js',         '_drum_46_11_Chaos_sf2_file'],            // drums-hihat_open
]);

const Player = (audioContext) => {

  const playingNodes = new Set();

  let webAudioFontPlayer = null;
  let presets;
  let pitches;

  const contextInitLoader = util.LazyLoader(() => {
    return new Promise((resolve, reject) => {
      if (audioContext.state !== 'running') {
        reject('invalid audioContext state');
      }

      webAudioFontPlayer = new WebAudioFontPlayer();

      webAudioFontPresetPathsAndVarNames.forEach(([webAudioFontPresetPath, webAudioFontPresetVarName]) =>
        webAudioFontPlayer.loader.startLoad(audioContext, webAudioFontPresetPath, webAudioFontPresetVarName));

      webAudioFontPlayer.loader.waitLoad(() => {
        presets = Object.freeze({
          [PRESET_NAME_PIANO]:                      window['_tone_0000_JCLive_sf2_file'],
          [PRESET_NAME_GUITAR_NYLON]:               window['_tone_0253_Acoustic_Guitar_sf2_file'],
          [PRESET_NAME_GUITAR_STEEL]:               window['_tone_0250_LK_AcousticSteel_SF2_file'],
          [PRESET_NAME_GUITAR_ELECTRIC_JAZZ]:       window['_tone_0260_SoundBlasterOld_sf2'],
          [PRESET_NAME_GUITAR_ELECTRIC_OVERDRIVE]:  window['_tone_0290_SoundBlasterOld_sf2'],
          [PRESET_NAME_GUITAR_BASS]:                window['_tone_0330_Aspirin_sf2_file'],
          [PRESET_NAME_DRUMS_KICK]:                 window['_drum_36_11_Chaos_sf2_file'],
          [PRESET_NAME_DRUMS_SNARE]:                window['_drum_40_11_Chaos_sf2_file'],
          [PRESET_NAME_DRUMS_CRASH]:                window['_drum_49_11_Chaos_sf2_file'],
          [PRESET_NAME_DRUMS_HIHAT]:                window['_drum_42_11_Chaos_sf2_file'],
          [PRESET_NAME_DRUMS_HIHAT_OPEN]:           window['_drum_46_11_Chaos_sf2_file']
        });
        pitches = Object.freeze({
          [PRESET_NAME_DRUMS_KICK]: 36,
          [PRESET_NAME_DRUMS_SNARE]: 40,
          [PRESET_NAME_DRUMS_CRASH]: 49,
          [PRESET_NAME_DRUMS_HIHAT]: 42,
          [PRESET_NAME_DRUMS_HIHAT_OPEN]: 46
        });

        resolve();
      });
    });
  });

  const addPlayingNode = (node) => {
    node.addEventListener('ended', () => {
      playingNodes.delete(node);
    });
    playingNodes.add(node);
  };

  return Object.freeze({
    play: (presetName, when, duration, pitch, volume = 1) => {
      if (typeof pitch === 'undefined' && !(presetName in pitches)) {
        throw 'invalid pitch';
      }
      if (typeof pitch === 'undefined') {
        pitch = pitches[presetName];
      }
      contextInitLoader.get().then(() => {
        const gainNode = webAudioFontPlayer.queueWaveTable(
            audioContext, audioContext.destination,
            presets[presetName], when,  pitch, duration, volume);
        const node = gainNode.audioBufferSourceNode;
        addPlayingNode(node);
      });
    },
    strum: (presetName, strumDirection, when, duration, pitches, volume = 1) => {
      contextInitLoader.get().then(() => {
        const strumFn = strumDirection === STRUM_DIRECTION_UP ? webAudioFontPlayer.queueStrumUp : webAudioFontPlayer.queueStrumDown;
        const gainNodes = strumFn.bind(webAudioFontPlayer)(audioContext, audioContext.destination, presets[presetName], when, pitches, duration, volume);
        gainNodes.forEach((gainNode) => {
          const node = gainNode.audioBufferSourceNode;
          addPlayingNode(node);
        });
      });
    },
    stop: () => {
      playingNodes.forEach((node) => node.stop());
      playingNodes.clear();
    },
    get playingNotesValuesIterator(){return playingNodes.values();},
    get currentTime(){return audioContext.currentTime;},
    get contextInitLoader(){return contextInitLoader;},
    get presets(){return presets;},
    get webAudioFontPlayer(){return webAudioFontPlayer;},
    get audioContext(){return audioContext;}
  });
};


export {
  webAudioFontPresetPathsAndVarNames,
  STRUM_DIRECTION_UP, STRUM_DIRECTION_DOWN,
  PRESET_NAME_PIANO, PRESET_NAME_GUITAR_NYLON, PRESET_NAME_GUITAR_STEEL,
  PRESET_NAME_GUITAR_ELECTRIC_OVERDRIVE, PRESET_NAME_GUITAR_ELECTRIC_JAZZ, PRESET_NAME_GUITAR_BASS,
  PRESET_NAME_DRUMS_KICK, PRESET_NAME_DRUMS_SNARE,
  PRESET_NAME_DRUMS_CRASH, PRESET_NAME_DRUMS_HIHAT, PRESET_NAME_DRUMS_HIHAT_OPEN, PRESET_NAMES,
  Player
};
