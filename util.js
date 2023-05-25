const cyclicIndex = (length, index) => {
  if (!Number.isInteger(length) || length < 0) {
    throw 'invalid length';
  }
  if (!Number.isInteger(index)) {
    throw 'invalid index';
  }
  if (index < 0) {
    index = (length + (index % length)) % length;
  }
  else if (index >= length) {
    index %= length;
  }
  return index;
};

const randomInt = (max, excl = null) => {
  if (!Number.isInteger(max) || max < 0) {
    throw 'invalid max';
  }
  if (excl === null) {
    return Math.trunc(Math.random() * max);
  }
  else {
    if (!Number.isInteger(excl) || excl < 0 || excl >= max) {
      throw 'invalid excl';
    }
    const randTemp = Math.trunc(Math.random() * (max - 1));
    return randTemp >= excl ? randTemp + 1 : randTemp;
  }
};

const randomChoice = (arr, exclIndex = null) => {
  if (!Array.isArray(arr)) {
    throw 'invalid arr';
  }
  return arr[randomInt(arr.length, exclIndex)];
};
const randomChance = (outOf) => randomInt(outOf) === 0;

const LazyLoader = (promiseFn) => {
  let promise = null;
  return Object.freeze({
    get: () => {
      if (promise === null) {
        promise = Promise.resolve(promiseFn());
      }
      return promise;
    }
  });
};

export {
  cyclicIndex,
  randomInt, randomChance, randomChoice,
  LazyLoader
};
