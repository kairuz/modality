import WebAudioFontPlayer from "https://kairuz.github.io/webaudiofont/npm/dist/player.js";


const STRUM_DIRECTION_DOWN = 0;
const STRUM_DIRECTION_UP = 1;
const STRUM_DIRECTION = [STRUM_DIRECTION_DOWN, STRUM_DIRECTION_UP];

const PRESET_NAME_PIANO                     = 'piano';
const PRESET_NAME_GUITAR_NYLON              = 'guitar-nylon';
const PRESET_NAME_GUITAR_STEEL              = 'guitar-steel';
const PRESET_NAME_GUITAR_ELECTRIC_JAZZ      = 'guitar-electric-jazz';
const PRESET_NAME_GUITAR_ELECTRIC_OVERDRIVE = 'guitar-electric-overdrive';
const PRESET_NAME_GUITAR_BASS               = 'guitar-bass';
const PRESET_NAME_DRUMS_KICK                = 'drums-kick';
const PRESET_NAME_DRUMS_SNARE               = 'drums-snare';
const PRESET_NAME_DRUMS_CRASH               = 'drums-crash';
const PRESET_NAME_DRUMS_HIHAT               = 'drums-hihat';
const PRESET_NAME_DRUMS_HIHAT_OPEN          = 'drums-hihat_open';
const PRESET_NAMES = Object.freeze([PRESET_NAME_PIANO, PRESET_NAME_GUITAR_NYLON, PRESET_NAME_GUITAR_STEEL,
                                    PRESET_NAME_GUITAR_ELECTRIC_JAZZ, PRESET_NAME_GUITAR_ELECTRIC_OVERDRIVE, PRESET_NAME_GUITAR_BASS,
                                    PRESET_NAME_DRUMS_KICK, PRESET_NAME_DRUMS_SNARE,
                                    PRESET_NAME_DRUMS_CRASH, PRESET_NAME_DRUMS_HIHAT, PRESET_NAME_DRUMS_HIHAT_OPEN]);

const PRESET_PATHS_AND_VAR_NAMES = Object.freeze({
  [PRESET_NAME_PIANO]:                      Object.freeze(['https://surikov.github.io/webaudiofontdata/sound/0000_JCLive_sf2_file.js',            '_tone_0000_JCLive_sf2_file']),
  [PRESET_NAME_GUITAR_NYLON]:               Object.freeze(['https://surikov.github.io/webaudiofontdata/sound/0253_Acoustic_Guitar_sf2_file.js',   '_tone_0253_Acoustic_Guitar_sf2_file']),
  [PRESET_NAME_GUITAR_STEEL]:               Object.freeze(['https://surikov.github.io/webaudiofontdata/sound/0250_LK_AcousticSteel_SF2_file.js',  '_tone_0250_LK_AcousticSteel_SF2_file']),
  [PRESET_NAME_GUITAR_ELECTRIC_JAZZ]:       Object.freeze(['https://surikov.github.io/webaudiofontdata/sound/0260_SoundBlasterOld_sf2.js',        '_tone_0260_SoundBlasterOld_sf2']),
  [PRESET_NAME_GUITAR_ELECTRIC_OVERDRIVE]:  Object.freeze(['https://surikov.github.io/webaudiofontdata/sound/0290_SoundBlasterOld_sf2.js',        '_tone_0290_SoundBlasterOld_sf2']),
  [PRESET_NAME_GUITAR_BASS]:                Object.freeze(['https://surikov.github.io/webaudiofontdata/sound/0330_Aspirin_sf2_file.js',           '_tone_0330_Aspirin_sf2_file']),
  [PRESET_NAME_DRUMS_KICK]:                 Object.freeze(['https://surikov.github.io/webaudiofontdata/sound/12836_11_Chaos_sf2_file.js',         '_drum_36_11_Chaos_sf2_file']),
  [PRESET_NAME_DRUMS_SNARE]:                Object.freeze(['https://surikov.github.io/webaudiofontdata/sound/12840_11_Chaos_sf2_file.js',         '_drum_40_11_Chaos_sf2_file']),
  [PRESET_NAME_DRUMS_CRASH]:                Object.freeze(['https://surikov.github.io/webaudiofontdata/sound/12849_11_Chaos_sf2_file.js',         '_drum_49_11_Chaos_sf2_file']),
  [PRESET_NAME_DRUMS_HIHAT]:                Object.freeze(['https://surikov.github.io/webaudiofontdata/sound/12842_11_Chaos_sf2_file.js',         '_drum_42_11_Chaos_sf2_file']),
  [PRESET_NAME_DRUMS_HIHAT_OPEN]:           Object.freeze(['https://surikov.github.io/webaudiofontdata/sound/12846_11_Chaos_sf2_file.js',         '_drum_46_11_Chaos_sf2_file'])
});

const PITCHES = Object.freeze({
  [PRESET_NAME_DRUMS_KICK]:       36,
  [PRESET_NAME_DRUMS_SNARE]:      40,
  [PRESET_NAME_DRUMS_CRASH]:      49,
  [PRESET_NAME_DRUMS_HIHAT]:      42,
  [PRESET_NAME_DRUMS_HIHAT_OPEN]: 46
});


const PLAY_TYPE_STRIKE = 0;
const PLAY_TYPE_STRUM = 1;


const Strike = (presetName, when, pitch, duration, volume = 1) => {
  if (!PRESET_NAMES.includes(presetName)) {
    throw 'invalid presetName';
  }

  return {
    get type(){return PLAY_TYPE_STRIKE;},
    get presetName(){return presetName;},
    get when(){return when;},
    get pitch(){return pitch;},
    get duration(){return duration;},
    get volume(){return volume;}
  };
};

const Strum = (presetName, when, pitches, direction, duration, volume = 1) => {
  if (!PRESET_NAMES.includes(presetName)) {
    throw 'invalid presetName';
  }
  if (!STRUM_DIRECTION.includes(direction)) {
    throw 'invalid strum direction';
  }

  return {
    get type(){return PLAY_TYPE_STRUM;},
    get presetName(){return presetName;},
    get when(){return when;},
    get pitches(){return pitches;}, // Must allow mutation as WebAudioFontPlayer sorts pitches
    get direction(){return direction;},
    get duration(){return duration;},
    get volume(){return volume;}
  };
};

const Riff = () => {
  const plays = [];

  const addStrike = (presetName, when, pitch, duration, volume = 1) => {
    plays.push(Strike(presetName, when, pitch, duration, volume));
  };

  const addStrum = (presetName, when, _pitches, direction, duration, volume = 1) => {
    plays.push(Strum(presetName, when, _pitches, direction, duration, volume));
  };

  return {
    addStrum,
    addStrike,
    playsValues: () => plays.values()
  }
};


const initPlayerContext = (audioContext) => {
  return new Promise((resolve, reject) => {
    if (audioContext.state !== 'running') {
      reject('invalid audioContext state');
      return;
    }

    const webAudioFontPlayer = new WebAudioFontPlayer();

    PRESET_NAMES.forEach((presetName) => {
      const [presetPath, presetVarName] = PRESET_PATHS_AND_VAR_NAMES[presetName];
      webAudioFontPlayer.loader.startLoad(audioContext, presetPath, presetVarName);
    });

    webAudioFontPlayer.loader.waitLoad(() => {
      const presets = Object.freeze(PRESET_NAMES.reduce((acc, presetName) => {
        const [, presetVarName] = PRESET_PATHS_AND_VAR_NAMES[presetName];
        acc[presetName] = window[presetVarName];
        return acc;
      }, {}));

      const playerContext = PlayerContext(audioContext, webAudioFontPlayer, presets);

      resolve(playerContext);
    });
  });
};

const PlayerContext = (audioContext, webAudioFontPlayer, presets) => {
  return {
    get audioContext(){return audioContext;},
    get webAudioFontPlayer(){return webAudioFontPlayer},
    get presets(){return presets;}
  };
};

const Player = (playerContext) => {
  const playingNodes = new Set();

  const addPlayingNode = (node) => {
    node.addEventListener('ended', () => {
      playingNodes.delete(node);
    });
    playingNodes.add(node);
  };

  const strike = (strike) => {
    const gainNode = playerContext.webAudioFontPlayer.queueWaveTable(
        playerContext.audioContext, playerContext.audioContext.destination,
        playerContext.presets[strike.presetName], strike.when, strike.pitch, strike.duration, strike.volume);
    const node = gainNode.audioBufferSourceNode;
    addPlayingNode(node);
  };

  const strum = (strum) => {
    const strumFn = strum.direction === STRUM_DIRECTION_UP ?
                    playerContext.webAudioFontPlayer.queueStrumUp :
                    playerContext.webAudioFontPlayer.queueStrumDown;
    const gainNodes = strumFn.bind(playerContext.webAudioFontPlayer)(playerContext.audioContext, playerContext.audioContext.destination,
                                                                     playerContext.presets[strum.presetName], strum.when, strum.pitches,
                                                                     strum.duration, strum.volume);
    gainNodes.forEach((gainNode) => {
      const node = gainNode.audioBufferSourceNode;
      addPlayingNode(node);
    });
  };

  return {
    play: (play) => {
      if (play.type === PLAY_TYPE_STRIKE) {
        strike(play);
      }
      else if (play.type === PLAY_TYPE_STRUM) {
        strum(play);
      }
    },
    stop: () => {
      playingNodes.forEach((node) => node.stop());
      playingNodes.clear();
    },
    get playingNotesValuesIterator(){return playingNodes.values();},
    get currentTime(){return playerContext.audioContext.currentTime;},
    get presets(){return playerContext.presets;},
    get webAudioFontPlayer(){return playerContext.webAudioFontPlayer;},
    get audioContext(){return playerContext.audioContext;}
  };
};

const initPlayer = (audioContext) => {
  return initPlayerContext(audioContext)
      .then((playerContext) => Promise.resolve(Player(playerContext)));
};


export {
  PRESET_PATHS_AND_VAR_NAMES, PITCHES,
  STRUM_DIRECTION_UP, STRUM_DIRECTION_DOWN, STRUM_DIRECTION,
  PRESET_NAME_PIANO, PRESET_NAME_GUITAR_NYLON, PRESET_NAME_GUITAR_STEEL,
  PRESET_NAME_GUITAR_ELECTRIC_OVERDRIVE, PRESET_NAME_GUITAR_ELECTRIC_JAZZ, PRESET_NAME_GUITAR_BASS,
  PRESET_NAME_DRUMS_KICK, PRESET_NAME_DRUMS_SNARE,
  PRESET_NAME_DRUMS_CRASH, PRESET_NAME_DRUMS_HIHAT, PRESET_NAME_DRUMS_HIHAT_OPEN, PRESET_NAMES,
  PLAY_TYPE_STRIKE, PLAY_TYPE_STRUM,
  Riff, initPlayer
};
