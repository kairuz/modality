import * as domain from "./domain.js";
import * as glossary from "./glossary.js";


const OCTAVES = 9;
const MIN_INDEX = glossary.indexForKeyName('A');
const MAX_INDEX = (glossary.keyNamesLength * (OCTAVES - 1));

const Piano = (octaves = OCTAVES) => {

  let diatonics = 0;
  let accidentals = 0;

  const PianoKey = (index) => {
    const number = index + 1;
    const keyIndex = index + MIN_INDEX;
    const key = glossary.keyNameForIndex(keyIndex);
    const octave = Math.trunc(keyIndex / domain.SEMITONES);
    const isAccidental = domain.SCALE_MAJOR.getFlag(keyIndex) === 0;
    const isDiatonic = !isAccidental;
    return Object.freeze({
      get index(){return index;},
      get number(){return number;},
      get keyIndex(){return keyIndex;},
      get key(){return key;},
      get octave(){return octave;},
      get isDiatonic(){return isDiatonic;},
      get isAccidental(){return isAccidental;},
      toString: function(){
        return `number=${number},ki=${keyIndex},keyOct=${this.key}-${octave},isAcc=${this.isAccidental}`
      }
    });
  };

  const pianoKeys = Object.freeze(Array.from(Array(octaves * domain.SEMITONES).keys()).map((_, i) => {
    if (i < MIN_INDEX || i > MAX_INDEX) {
      return null;
    }

    const pianoKey = PianoKey(i - MIN_INDEX);
    if (pianoKey.isAccidental) {
      accidentals++;
    }
    else {
      diatonics++;
    }
    return pianoKey;

  }));

  return Object.freeze({
    getPianoKeyUi(index){
      if (!Number.isInteger(index) || index < MIN_INDEX || index > MAX_INDEX) {
        throw 'invalid index';
      }
      return pianoKeys[index];
    },
    forEachPianoKey(callback) {
      let i = 0;
      for (const pianoKey of pianoKeys) {
        const ii = i;
        i++;
        if (ii < MIN_INDEX || ii > MAX_INDEX) {
          continue;
        }
        callback(pianoKey, ii);
      }
    },

    get diatonics(){return diatonics;},
    get accidentals(){return accidentals;}
  });
};


const KEY_WIDTH = 18;
const KEY_HEIGHT = 72;

const ACC_WIDTH_FACTOR = 2/3;
const ACC_HEIGHT_FACTOR = 6/9;

const PianoUi = (piano = Piano()) => {

  const pianoUiDiv = document.createElement('div');
  pianoUiDiv.classList.add('pianoUiDiv');
  pianoUiDiv.style.width = `${KEY_WIDTH * piano.diatonics}px`;
  pianoUiDiv.style.height = `${KEY_HEIGHT}px`;
  pianoUiDiv.style.boxSizing = 'border-box';
  pianoUiDiv.style.position = 'absolute';

  const PianoKeyUi = (pianoKey) => {
    const pianoKeyUiDiv = document.createElement('div');
    pianoKeyUiDiv.classList.add('pianoKeyUiDiv');
    pianoKeyUiDiv.style.position = 'absolute';
    pianoKeyUiDiv.style.border = '1px solid black';
    pianoKeyUiDiv.style.boxSizing = 'border-box';

    let highlighted = false;
    let background = pianoKey.isDiatonic ? 'white' : 'black';
    const [keyWidth, keyHeight] = pianoKey.isDiatonic ?
        [KEY_WIDTH, KEY_HEIGHT] :
        [KEY_WIDTH * ACC_WIDTH_FACTOR, KEY_HEIGHT * ACC_HEIGHT_FACTOR];

    pianoKeyUiDiv.style.width = `${keyWidth}px`;
    pianoKeyUiDiv.style.height = `${keyHeight}px`;
    pianoKeyUiDiv.style.background = background;

    return Object.freeze({
      get div(){return pianoKeyUiDiv;},
      get pianoKey(){return pianoKey;},
      select: () => {
        pianoKeyUiDiv.style.background = 'lightgreen';
      },
      deselect: () => {
        pianoKeyUiDiv.style.background = highlighted ? 'lightblue' : background;
      },
      setBackground(color) {
        background = color;
        pianoKeyUiDiv.style.background = color;
      }
    });
  };

  const pianoKeyUis = Object.freeze(Array.from(Array(MAX_INDEX + 1).keys()).map((_, i) => {
    if (i < MIN_INDEX || i > MAX_INDEX) {
      return null;
    }

    const pianoKey = piano.getPianoKeyUi(i);
    const pianoKeyUi = PianoKeyUi(pianoKey);
    return pianoKeyUi;
  }));


  {
    let lastDiatonicLeft = 0;
    let diatonics = 0;
    let pianoKeyUiPrev = null;

    const pianoKeyUisAccidentals = [];
    for (let i = MIN_INDEX; i <= MAX_INDEX; i++) {
      const pianoKeyUi = pianoKeyUis[i];
      if (pianoKeyUi.pianoKey.isDiatonic) {
        const left = diatonics * KEY_WIDTH;
        pianoKeyUi.div.style.left = `${left}px`;
        lastDiatonicLeft =  left;
        diatonics++;
        pianoUiDiv.appendChild(pianoKeyUi.div);
      }
      else {
        pianoKeyUi.div.style.left = `${(lastDiatonicLeft + KEY_WIDTH) - ((KEY_WIDTH * ACC_WIDTH_FACTOR) / 2)}px`;
        pianoKeyUisAccidentals.push(pianoKeyUi);
      }

      pianoKeyUiPrev = pianoKeyUi;
    }

    pianoKeyUisAccidentals.forEach((pianoKeyUiAccidental) => pianoUiDiv.appendChild(pianoKeyUiAccidental.div));

  }

  return Object.freeze({
    get div(){return pianoUiDiv;},
    get piano(){return piano;},
    getPianoKeyUi(index){
      if (!Number.isInteger(index) || index < MIN_INDEX || index > MAX_INDEX) {
        throw 'invalid index ' + index;
      }
      return pianoKeyUis[index];
    },
    forEachPianoKeyUi(callback) {
      let i = 0;
      for (const pianoKeyUi of pianoKeyUis) {
        const ii = i;
        i++;
        if (ii < MIN_INDEX || ii > MAX_INDEX) {
          continue;
        }
        callback(pianoKeyUi, ii);
      }
    }
  });
};

export {
  OCTAVES, MIN_INDEX, MAX_INDEX,
  KEY_WIDTH, KEY_HEIGHT, ACC_WIDTH_FACTOR, ACC_HEIGHT_FACTOR,
  Piano, PianoUi
};
