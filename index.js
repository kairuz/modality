import {SCALES, SCALE_NAMES, SCALES_NAMES_MODES_NAMES,
  SCALE_NAME_MAJOR, SCALE_NAME_HARMONIC_MINOR,
  SCALE_NAME_HARMONIC_MAJOR, SCALE_NAME_MELODIC_MINOR} from "./glossary.js";
import {SEMITONES} from "./scale.js";
import {LazyLoader, AllowedIndexes} from "./util.js";
import {CHANGE_NONE} from "./conductor.js";
import initConductor from "./factory.js";
import {PianoUi, MIN_INDEX, MAX_INDEX} from "./piano.js";
import {MasterVolumeControl, ScaleToggleUi, CaptureDiffUi, BarUi, CaptureUi} from "./ui.js";


const volumeFactorCallback = () => masterVolumeControl.masterVolume / 100;

const leadRifferQueueCallback = (currPresetName, currentTime, when, whenOffset, duration, pitch, currVolume) => {
  if (pitch >= MIN_INDEX && pitch <= MAX_INDEX) {
    const selectTimeoutId = setTimeout(() => {
      leadRifferTimeoutIds.delete(selectTimeoutId);
      pianoUi.getPianoKeyUi(pitch).select();

      const deselectTimeoutId = setTimeout(() => {
        leadRifferTimeoutIds.delete(deselectTimeoutId);
        pianoUi.getPianoKeyUi(pitch).deselect();
      }, duration * 1000);

      leadRifferTimeoutIds.add(deselectTimeoutId);
    }, ((when + whenOffset) - currentTime) * 1000);

    leadRifferTimeoutIds.add(selectTimeoutId);
  }
};

const conductorChangeCallback = (changeType, currentTime, when, bar, composerCapture, composerPrevCapture) => {
  setTimeout(() => {
    updatePianoKeyColor(composerPrevCapture, pianoUi, 'white', 'black', 'white', 'black', 1, 2); // unset
    updatePianoKeyColor(composerCapture, pianoUi, 'lightblue', 'lightblue', 'cornflowerblue', 'cornflowerblue', 1, 2);

    const transformHeight = (div, startHeightPx, endHeightPx) => {
      div.style.overflow = 'hidden';
      div.style.height = `${startHeightPx}px`;
      div.style.transition = '1s ease height';
      div.offsetHeight;
      div.style.height = `${endHeightPx}px`;
    };

    if (changeType !== CHANGE_NONE) {
      const ui = CaptureDiffUi(composerCapture, composerPrevCapture, bar, when - startTime, changeType);
      const captureDiffAndPrevPianoDiv = document.createElement('div');
      captureDiffAndPrevPianoDiv.classList.add('captureDiffAndPrevPiano');
      const prevPianoDiv = document.createElement('div');
      prevPianoDiv.classList.add('prevPiano');
      captureDiffAndPrevPianoDiv.appendChild(ui.div);
      captureDiffAndPrevPianoDiv.appendChild(prevPianoDiv);
      const prevPianoUi = PianoUi();
      updatePianoKeyColor(composerPrevCapture, prevPianoUi, 'lightcoral', 'lightcoral', 'crimson', 'crimson', 1, 2);
      updatePianoKeyColor(composerCapture, prevPianoUi, 'lightgreen', 'lightgreen', 'olivedrab', 'olivedrab', 4, 5);
      prevPianoDiv.appendChild(prevPianoUi.div);
      uiDivsBuffer.push(captureDiffAndPrevPianoDiv);
      uisBufferDiv.prepend(captureDiffAndPrevPianoDiv);
      transformHeight(captureDiffAndPrevPianoDiv, 0, 300);
    }
    else {
      const ui = BarUi(bar, when - startTime);
      uiDivsBuffer.push(ui.div);
      uisBufferDiv.prepend(ui.div);
      transformHeight(ui.div, 0, 40);
    }

    captureUi.update(composerCapture);

    if (uiDivsBuffer.length > UIS_BUFFER_LIMIT) {
      const shiftedUiDiv = uiDivsBuffer.shift();
      shiftedUiDiv.remove();
    }
  }, ((when - currentTime) - 250) * 1000);
};

const defaultAllowedScalesIndexesList = Object.freeze([
    SCALE_NAMES.indexOf(SCALE_NAME_MAJOR),
    SCALE_NAMES.indexOf(SCALE_NAME_HARMONIC_MINOR),
    SCALE_NAMES.indexOf(SCALE_NAME_HARMONIC_MAJOR),
    SCALE_NAMES.indexOf(SCALE_NAME_MELODIC_MINOR)
]);
const allowedScaleIndexes = AllowedIndexes(SCALES.length, defaultAllowedScalesIndexesList);

const audioContextLoader = LazyLoader(() => {
  return Promise.resolve(new AudioContext());
});

const audioContextAndConductorLoader = LazyLoader(() => {
  return audioContextLoader
      .get()
      .then((audioContext) => initConductor(audioContext, volumeFactorCallback, allowedScaleIndexes, leadRifferQueueCallback, conductorChangeCallback)
          .then((conductor) => Promise.resolve([audioContext, conductor])));
});

let startTime = null;

const wasStarted = () => startTime !== null;
const uiDivsBuffer = [];
const UIS_BUFFER_LIMIT = 40;

const captureUi = CaptureUi();
const captureUiDiv = document.getElementById('capture-ui');
captureUiDiv.appendChild(captureUi.div);

const pianoUi = PianoUi();
const pianoUiDiv = document.getElementById('piano-ui');
pianoUiDiv.appendChild(pianoUi.div);

const uisBufferDiv = document.getElementById('uis-buffer');

const updatePianoKeyColor = (composerCapture, _pianoUi,
                             modeColor, modeColorAcc, chordColor, chordColorAcc,
                             modeOctave, chordOctave) => {
  const modeOffsets = SCALES[composerCapture.scaleIndex].getModeOffsets(composerCapture.modeIndex + composerCapture.chordIndex);
  const modeHighlightOffset = (SEMITONES * modeOctave) + composerCapture.chordKeyIndex;
  modeOffsets.forEach((modeOffset) => {
    const pianoKeyUi = _pianoUi.getPianoKeyUi(modeHighlightOffset + modeOffset);
    pianoKeyUi.setBackground(pianoKeyUi.pianoKey.isAccidental ? modeColorAcc : modeColor);
  });

  const chordOffsets = SCALES[composerCapture.scaleIndex].getChordOffsets(composerCapture.chordType, composerCapture.modeIndex + composerCapture.chordIndex);
  const chordHighlightOffset = (SEMITONES * chordOctave) + composerCapture.chordKeyIndex;
  chordOffsets.forEach((chordOffset) => {
    const pianoKeyUi = _pianoUi.getPianoKeyUi(chordHighlightOffset + chordOffset);
    pianoKeyUi.setBackground(pianoKeyUi.pianoKey.isAccidental ? chordColorAcc : chordColor);
  });
};

const leadRifferTimeoutIds = new Set();

const stop = () => {
  if (!navigator.userActivation.hasBeenActive) {
    throw 'user has not yet been active';
  }

  if (wasStarted()) {
    audioContextAndConductorLoader.get().then(([, conductor]) => conductor.stop());
  }

  leadRifferTimeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
  leadRifferTimeoutIds.clear();
};

const start = () => {
  if (!navigator.userActivation.hasBeenActive) {
    throw 'user has not yet been active';
  }

  stop();
  uiDivsBuffer.forEach((uiDiv) => {
    uiDiv.remove();
  });
  uiDivsBuffer.length = 0;

  pianoUi.forEachPianoKeyUi((pianoKeyUi) => {
    pianoKeyUi.setBackground(pianoKeyUi.pianoKey.isAccidental ? 'black' : 'white');
  });

  audioContextAndConductorLoader
      .get()
      .then(([audioContext, conductor]) => {
        startTime = audioContext.currentTime;
        conductor.start();

        const composerCapture = conductor.composer.capture();

        captureUi.update(composerCapture);
        updatePianoKeyColor(conductor.composer.capture(), pianoUi, 'lightblue', 'lightblue', 'cornflowerblue', 'cornflowerblue', 1, 2);

        const barUi = BarUi(0, conductor.player.currentTime - startTime);
        uiDivsBuffer.push(barUi.div);
        uisBufferDiv.prepend(barUi.div);
      });
};

const masterVolumeControl = MasterVolumeControl();

const loadMasterVolumeControl = () => {
  const masterVolumeInput = document.getElementById('master-volume');
  const masterVolumeInputLabel = document.getElementById('master-volume-label');
  masterVolumeInput.value = `${masterVolumeControl.masterVolume}`;
  masterVolumeInput.style.visibility = null;
  masterVolumeInputLabel.style.visibility = null;
  masterVolumeInput.addEventListener('input', masterVolumeControl.input);
};

const loadAllowedScalesCheckboxes = () => {
  let disabledScaleToggleUiIndex = null;

  const includeCallback = (scaleIndex) => {
    if (allowedScaleIndexes.size === 1 && scaleToggleUis[disabledScaleToggleUiIndex].checkbox.checked === false) {
      scaleToggleUis[disabledScaleToggleUiIndex].checkbox.checked = true
    }
    allowedScaleIndexes.add(scaleIndex);
    if (allowedScaleIndexes.size === 1) {
      return;
    }
    if (disabledScaleToggleUiIndex !== null) {
      scaleToggleUis[disabledScaleToggleUiIndex].checkbox.disabled = false;
      disabledScaleToggleUiIndex = null;
    }
  };

  const excludeCallback = (scaleIndex) => {
    if (allowedScaleIndexes.size === 1) {
      if (scaleToggleUis[disabledScaleToggleUiIndex].checkbox.checked === false) {
        scaleToggleUis[disabledScaleToggleUiIndex].checkbox.checked = true
      }
      return;
    }
    allowedScaleIndexes.delete(scaleIndex);
    if (allowedScaleIndexes.size === 1) {
      disabledScaleToggleUiIndex = allowedScaleIndexes.values().next().value;
      scaleToggleUis[disabledScaleToggleUiIndex].checkbox.disabled = true;
    }
  };

  const allowedScalesDiv = document.getElementById('allowed-scales');

  const scaleToggleUis = SCALES_NAMES_MODES_NAMES.map(([scale, scaleName,], i) => {
    return ScaleToggleUi(i, scale, scaleName, includeCallback, excludeCallback, allowedScaleIndexes.has(i));
  });

  scaleToggleUis.forEach((scaleToggleUi) => {
    const div = document.createElement('div');
    div.style.display = 'inline-block';
    div.appendChild(scaleToggleUi.checkbox);
    div.appendChild(scaleToggleUi.label);
    allowedScalesDiv.appendChild(div);
  });
};

window.addEventListener('load', () => {
  loadMasterVolumeControl();
  document.getElementById('button-stop').addEventListener('click', stop);
  document.getElementById('button-start').addEventListener('click', start);
  loadAllowedScalesCheckboxes();
});
