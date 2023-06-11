import {SCALES, scaleNameForOffsets, keyNameForIndex,
  modeNameForOffsets, chordNameForOffsets} from "./glossary.js";


const ScaleToggleUi = (scaleIndex, scale, scaleName, includeCallback, excludeCallback, checked = true) => {
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  const checkboxId = `scaleToggleCheckbox_${scaleIndex}`;
  checkbox.id = checkboxId;
  checkbox.classList.add('toggle');
  checkbox.checked = checked;

  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      includeCallback(scaleIndex);
    }
    else {
      excludeCallback(scaleIndex);
    }
  });

  const label = document.createElement('label');
  label.htmlFor = checkboxId;
  label.id = `${checkboxId}_label`;
  label.style.marginRight = '10px';
  label.appendChild(document.createTextNode(scaleName));

  return {
    get checkbox(){return checkbox;},
    get label(){return label;}
  };
};

const CAPTURE_FIELD_NAME_SCALE = 'scale';
const CAPTURE_FIELD_NAME_ADJUSTED_MODE = 'adjustedMode';
const CAPTURE_FIELD_NAME_CHORD_TYPE = 'chordType';

const CAPTURE_FIELD_NAMES_DISPLAY_CALLBACKS = Object.freeze({
  [CAPTURE_FIELD_NAME_SCALE]            : (capture) => `${scaleNameForOffsets(SCALES[capture.scaleIndex].offsets)} Scale`,
  [CAPTURE_FIELD_NAME_ADJUSTED_MODE]    : (capture) =>
      `${keyNameForIndex(capture.chordKeyIndex)} ` +
      `${modeNameForOffsets(SCALES[capture.scaleIndex].getModeOffsets(capture.modeIndex + capture.chordIndex))}`,
  [CAPTURE_FIELD_NAME_CHORD_TYPE]       : (capture) =>
      `${keyNameForIndex(capture.chordKeyIndex)} ` +
      chordNameForOffsets(
          SCALES[capture.scaleIndex].getChordOffsets(capture.chordType, capture.modeIndex + capture.chordIndex))

});

const DESIRED_CAPTURE_DIFF_FIELD_NAMES = Object.freeze([
  CAPTURE_FIELD_NAME_SCALE,
  CAPTURE_FIELD_NAME_ADJUSTED_MODE,
  CAPTURE_FIELD_NAME_CHORD_TYPE
]);

const DESIRED_CAPTURE_FIELD_NAMES = Object.freeze([
  CAPTURE_FIELD_NAME_SCALE,
  CAPTURE_FIELD_NAME_ADJUSTED_MODE,
  CAPTURE_FIELD_NAME_CHORD_TYPE
]);

const CaptureUi = () => {
  let capture = null;

  const div = document.createElement('div');
  div.classList.add('uiDiv');

  const table = document.createElement('table');
  div.appendChild(table);
  table.classList.add('captureUiTable');

  const tdsObj = Object.freeze(DESIRED_CAPTURE_FIELD_NAMES.reduce((acc, fieldName) => {
    const row = document.createElement('tr');
    table.appendChild(row);
    const td = document.createElement('td');
    row.appendChild(td);
    td.classList.add('captureUiTd');
    acc[fieldName] = td;
    return acc;
  }, {}));

  const update = (_capture) => {
    capture = Object.freeze(_capture);

    DESIRED_CAPTURE_DIFF_FIELD_NAMES.forEach((fieldName) => {
      const valCallback = CAPTURE_FIELD_NAMES_DISPLAY_CALLBACKS[fieldName];
      const td = tdsObj[fieldName];
      const tdText = valCallback(capture);
      td.textContent = `${tdText}`;
    });
  };

  return {
    get capture(){return capture;},
    update,
    get tdsObj(){return tdsObj;},
    get div(){return div;}
  };
};

const BarUi = (bar, when) => {
  const div = document.createElement('div');
  div.classList.add('uiDiv');
  const infoDiv = document.createElement('div');
  infoDiv.classList.add('uiInfoDiv');
  div.appendChild(infoDiv);
  infoDiv.textContent = `bar ${bar} @ ${when.toFixed(2)}s`;

  return {
    get div(){return div;}
  };
};

const CaptureDiffUi = (_capture, _prevCapture = _capture, bar, when, changeType) => {
  const capture = Object.freeze(_capture);
  const prevCapture = Object.freeze(_prevCapture);

  const div = document.createElement('div');
  div.classList.add('uiDiv');
  const infoDiv = document.createElement('div');
  infoDiv.classList.add('uiInfoDiv');
  div.appendChild(infoDiv);
  infoDiv.textContent = `bar ${bar} @ ${when.toFixed(2)}s - changeType: ${changeType}`;
  const table = document.createElement('table');
  div.appendChild(table);
  table.classList.add('captureDiffUiTable');

  DESIRED_CAPTURE_DIFF_FIELD_NAMES.forEach((fieldName) => {
    const displayCallback = CAPTURE_FIELD_NAMES_DISPLAY_CALLBACKS[fieldName];

    const row = document.createElement('tr');
    table.appendChild(row);
    const tdPrev = document.createElement('td');
    row.appendChild(tdPrev);
    tdPrev.classList.add('captureDiffUiTd');
    const tdPrevText = displayCallback(prevCapture);
    tdPrev.textContent = `${tdPrevText}`;
    const td = document.createElement('td');
    row.appendChild(td);
    td.classList.add('captureDiffUiTd');
    const tdText = displayCallback(capture);
    td.textContent = `${tdText}`;

    if (tdPrevText !== tdText) {
      tdPrev.classList.add('captureUiTdChangedPrev');
      td.classList.add('captureUiTdChanged');
    }
    else {
      tdPrev.classList.add('captureUiTdUnchanged');
      td.classList.add('captureUiTdUnchanged');
    }

  });

  return {
    get capture(){return capture;},
    get prevCapture(){return prevCapture;},
    get div(){return div;}
  };
};


export {
  CAPTURE_FIELD_NAME_SCALE, CAPTURE_FIELD_NAME_ADJUSTED_MODE, CAPTURE_FIELD_NAME_CHORD_TYPE, CAPTURE_FIELD_NAMES_DISPLAY_CALLBACKS,
  DESIRED_CAPTURE_DIFF_FIELD_NAMES, DESIRED_CAPTURE_FIELD_NAMES,
  ScaleToggleUi, CaptureUi, BarUi, CaptureDiffUi
};
