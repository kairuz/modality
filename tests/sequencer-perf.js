import {Heap} from "../util.js";
import {Sequencer, FLUSH_ORDERED, FLUSH_UNORDERED} from "../conductor.js";

export default () => {
  const MockPlayer = () => {
    return {
      play: (play) => {
        // console.log(`mockPlayer play ${play}`);
      },
      get currentTime(){return Date.now();}
    };
  };

  const SortedPlayList = (compare) => {
    const isLessThan = (a, b) => compare(a, b) < 0;

    const arr = [];

    return {
      add(play) {

        if (this.isEmpty) {
          arr.push(play);
          return;
        }

        for (let i = 0; i < arr.length; i++) {
          const curr = arr[i];
          if (isLessThan(play, curr)) {
            arr.splice(i, 0, play);
            return;
          }
        }

        arr.push(play);

      },
      peek() {
        if (this.isEmpty) {
          throw 'linked list is empty';
        }
        return arr[0];
      },
      pop() {
        if (this.isEmpty) {
          throw 'linked list is empty';
        }
        return arr.shift();
      },
      clear() {
        arr.length = 0;
      },
      get isEmpty(){return arr.length === 0;},
      get isNotEmpty(){return !this.isEmpty},
      get size(){return arr.length;},
      toArray() {
        return [...arr];
      },
      values() {
        return arr.values()
      }
    }
  };

  const SortedPlayLinkedList = (compare) => {
    const isLessThan = (a, b) => compare(a, b) < 0;

    const Node = () => {
      return {
        next: null,
        play: null,
      };
    };
    let head = null;

    let length = 0;

    return {
      add(play) {
        const node = Node();
        node.play = play;
        if (this.isEmpty) {
          head = node;
        }
        else {
          let temp = head;
          let prev = null;
          let added = false;

          while (temp !== null) {
            if (isLessThan(play, temp.play)) {
              if (prev !== null) {
                prev.next = node;
              }
              node.next = temp;
              if (temp === head) {
                head = node;
              }

              added = true;
              break;
            }
            prev = temp;
            temp = temp.next;
          }

          if (!added) {
            if (prev !== null) {
              prev.next = node;
            }
            if (temp === head) {
              head = node;
            }
          }
        }

        length++;
      },
      peek() {
        if (this.isEmpty) {
          throw 'linked list is empty';
        }
        return head;
      },
      pop() {
        if (length === 0) {
          throw 'linked list is empty';
        }

        if (length === 1) {
          const _head = head;
          head = null;
          length = 0;
          return _head.play;
        }
        else {
          const _head = head;
          head = head.next;
          length--;
          return _head.play;
        }
      },
      clear() {
        head = null;
        length = 0;
      },
      get isEmpty(){return length === 0;},
      get isNotEmpty(){return !this.isEmpty},
      get size(){return length;},
      toArray() {
        const res = Array(length);
        let i = 0;
        let temp = head;
        while (temp !== null) {
          res[i++] = temp.play;
          temp = temp.next;
        }
        return res;
      },

      values() {
        return {
          [Symbol.iterator]() {
            let temp = head;
            return {
              next: () => {
                if (temp === null) {
                  return {value: null, done: true};
                }
                const value = temp.play;
                temp = temp.next;
                return {value: value, done: false};
              }
            };
          }
        };
      }
    }
  };


  const heapBasedSequencer = Sequencer(MockPlayer(), Heap((p1, p2) => p1.when - p2.when));
  const linkedListBasedSequencer = Sequencer(MockPlayer(), SortedPlayLinkedList((p1, p2) => p1.when - p2.when));
  const listBasedSequencer = Sequencer(MockPlayer(), SortedPlayList((p1, p2) => p1.when - p2.when));

  const ITERATIONS = 100;
  const NO_OF_PLAYS = [50, 500, 5000];

  NO_OF_PLAYS.forEach((noOfPlays) => {
    [[FLUSH_UNORDERED, 'flush-unordered'], [FLUSH_ORDERED, 'flush-ordered']].forEach(([flushType, flushName]) => {
      const rands = Array.from(Array(noOfPlays)).map(() => Math.trunc(Math.random() * 10000) / 1000);
      [
        ['   heap', heapBasedSequencer],
        ['lnkdLst', linkedListBasedSequencer],
        ['   list', listBasedSequencer]
      ].forEach(([typeName, sequencer]) => {

        const startTime = Date.now();
        for (let i = 0; i < ITERATIONS; i++) {
          rands.forEach((rand) => {
            sequencer.add({when: rand});
          });
          sequencer.stop(null, flushType);
        }

        const endTime = Date.now();

        console.log(`${typeName}, ${endTime - startTime} millis,\t${ITERATIONS} iters, ${noOfPlays} plays,\t${flushName}`);
      });
    });
  });
};
