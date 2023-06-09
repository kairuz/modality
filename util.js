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
  return {
    get: () => {
      if (promise === null) {
        promise = Promise.resolve(promiseFn());
      }
      return promise;
    }
  };
};

const Heap = (compare, isMax = false) => {
  const arr = [];
  const isGreaterThan = (a, b) => compare(a, b) > 0;

  const add = (val) => {
    arr.push(val);
    if (arr.length > 1) {
      const lastIndex = arr.length - 1;
      trickleUp(lastIndex);
    }
  };

  const trickleUp = (index) => {
    const val = arr[index];
    const parentInd = Math.floor((index - 1) / 2);
    const parentVal = arr[parentInd];

    if (parentInd >= 0 &&
        (isMax ?
         isGreaterThan(val, parentVal) :
         isGreaterThan(parentVal, val))) {
      arr[parentInd] = val;
      arr[index] = parentVal;
      trickleUp(parentInd);
    }
  };

  const peek = () => {
    if (arr.length === 0) {
      throw 'heap is empty';
    }
    return arr[0];
  };

  const pop = () => {
    if (arr.length === 0) {
      throw 'heap is empty';
    }
    else if (arr.length === 1) {
      return arr.pop();
    }
    const popped = arr[0];
    arr[0] = arr.pop();
    trickleDown(0);
    return popped;
  };

  const trickleDown = (index) => {
    const val = arr[index];
    const child1Index = (index * 2) + 1;

    const hasChild1 = child1Index in arr;

    if (hasChild1) {
      const child2Index = (index * 2) + 2;
      const child1Val = arr[child1Index];
      const hasChild2 = child2Index in arr;
      const child2Val = hasChild2 ? arr[child2Index] : null;

      const chosenChildIndex = hasChild2 &&
                               (isMax ? isGreaterThan(child2Val, child1Val) : isGreaterThan(child1Val, child2Val)) ?
                               child2Index : child1Index;
      const chosenChildValue = arr[chosenChildIndex];
      const violation = isMax ? isGreaterThan(chosenChildValue, val) : isGreaterThan(val, chosenChildValue);

      if (violation) {
        arr[index] = chosenChildValue;
        arr[chosenChildIndex] = val;
        trickleDown(chosenChildIndex);
      }
    }
  };

  return {
    add,
    peek,
    pop,
    clear: () => arr.length = 0,
    get isEmpty(){return arr.length === 0;},
    get isNotEmpty() {return !this.isEmpty;},
    get size() {return arr.length;},
    toArray: () => [...arr],
    values: () => arr.values()
  };

};


export {
  cyclicIndex,
  randomInt, randomChance, randomChoice,
  LazyLoader, Heap
};
