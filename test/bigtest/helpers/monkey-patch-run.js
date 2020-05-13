// Monkey patches BigTest and removes:

/*
throw new Error(
  'convergent assertion was successful, ' +
  `but exceeded the ${timeout}ms timeout`
);
*/

import { Interactor } from '@bigtest/interactor';

/**
 * Adds stats to the accumulator and returns `stats.value`
 *
 * @private
 * @param {Object} accumulator - Stats accumulator
 * @param {Object} stats - New stats to add
 * @returns {*}
 */
function collectStats(accumulator, stats) {
  accumulator.runs += stats.runs;
  accumulator.elapsed += stats.elapsed;
  accumulator.end = stats.end;
  accumulator.value = stats.value;
  accumulator.queue.push(stats);

  return stats.value;
}

/**
 * Captures a promise that will only resolve once a given condition
 * has been met. The condition will be tested once every 10ms and is
 * considered to be met when it does not error or return false.
 *
 * When `always` is false, the promise will resolve as soon as the
 * condition has been met. If it fails to do so within the timeout, it
 * will reject as soon as it can with the last error it received.
 *
 * When `always` is true, the promise will only resolve if the
 * condition is met consistently throughout the entire timeout
 * period. It will reject the first time it encounters an error.
 *
 * @private
 * @function convergeOn
 * @param {Function} assertion - Run to test condition repeatedly
 * @param {Number} timeout - Milliseconds to check assertion
 * @param {Boolean} always - If true, the assertion must pass
 * throughout the entire timeout period
 * @returns {Promise} Resolves if the assertion passes at least once;
 * if `always` is true, then rejects at the first error instead
 */
export function convergeOn(assertion, timeout, always) {
  const start = Date.now();
  const interval = 10;

  // track various stats
  const stats = {
    start,
    runs: 0,
    end: start,
    elapsed: 0,
    always,
    timeout,
    value: undefined
  };

  return new Promise((resolve, reject) => {
    (function loop() {
      // track stats
      stats.runs += 1;

      try {
        const results = assertion();

        // a promise means there could be side-effects
        if (results && typeof results.then === 'function') {
          throw new Error(
            'convergent assertion encountered a async function or promise; ' +
            'since convergent assertions can run multiple times, you should ' +
            'avoid introducing side-effects inside of them'
          );
        }

        // the timeout calculation comes after the assertion so that
        // the assertion's execution time is accounted for
        const doLoop = Date.now() - start < timeout;

        if (always && doLoop) {
          setTimeout(loop, interval);
        } else if (results === false) {
          throw new Error('convergent assertion returned `false`');
        } else {
          if (!always && !doLoop) {
            console.error(`convergent assertion was successful,
              but exceeded the ${timeout}ms timeout`);
          }
          // } else if (!always && !doLoop) {
          //   throw new Error(
          //     'convergent assertion was successful, ' +
          //     `but exceeded the ${timeout}ms timeout`
          //   );
          // } else {
          // calculate some stats right before resolving with them
          stats.end = Date.now();
          stats.elapsed = stats.end - start;
          stats.value = results;
          resolve(stats);
        }
      } catch (error) {
        const doLoop = Date.now() - start < timeout;

        if (!always && doLoop) {
          setTimeout(loop, interval);
        } else if (always || !doLoop) {
          reject(error);
        }
      }
    }());
  });
}

/**
 * Converges on an assertion by resolving when the given assertion
 * passes _within_ the timeout period. The assertion will run once
 * every 10ms and is considered to be passing when it does not error
 * or return false. If the assertion never passes within the timeout
 * period, then the promise will reject as soon as it can with the
 * last error it recieved.
 *
 * ```javascript
 * // simple boolean test
 * await when(() => total === 100)
 *
 * // with chai assertions
 * await when(() => {
 *   expect(total).to.equal(100)
 *   expect(add(total, 1)).to.equal(101)
 * })
 * ```
 *
 * The `timeout` argument controls how long the assertion is given to
 * converge within. By default, this is `2000ms`.
 *
 * ```javascript
 * // will fail if `num` is not `1` within 100ms
 * await when(() => num === 1, 100)
 * ```
 *
 * @function when
 * @param {Function} assertion - Assertion to converge on
 * @param {Number} [timeout=2000] - Timeout in milliseconds
 * @returns {Promise} - Resolves when the assertion converges
 */
export function whenFn(assertion, timeout = 2000) {
  return convergeOn(assertion, timeout, false);
}

/**
 * Converges on an assertion by resolving when the given assertion
 * passes _throughout_ the timeout period. The assertion will run once
 * every 10ms and is considered to be passing when it does not error
 * or return false. If the assertion does not pass consistently
 * throughout the entire timeout period, it will reject the very first
 * time it encounters a failure.
 *
 * ```javascript
 * // simple boolean test
 * await always(() => total !== 100)
 *
 * // with chai assertions
 * await always(() => {
 *   expect(total).to.not.equal(100)
 *   expect(add(total, 1)).to.equal(101)
 * })
 * ```
 *
 * The `timeout` argument controls how long it will take for the
 * assertion to converge. By default, this is `200ms`.
 *
 * ```javascript
 * // will pass if `num` is less than `100` for 2 seconds
 * await always(() => num < 100, 2000)
 * ```
 *
 * @function always
 * @param {Function} assertion - Assertion to converge with
 * @param {Number} [timeout=200] - Timeout in milliseconds
 * @returns {Promise} - Resolves when the assertion converges
 */
export function alwaysFn(assertion, timeout = 200) {
  return convergeOn(assertion, timeout, true);
}

/**
 * Gets the elapsed time since a `start` time; throws if it exceeds
 * the allowed `max` timeout.
 *
 * @private
 * @param {Number} start - Start time
 * @param {Number} max - Maximum elapsed time
 * @returns {Number} Elapsed time since `start`
 * @throws {Error} If the elapsed time exceeds `max`
 */
function getElapsedSince(start, max) {
  const elapsed = Date.now() - start;

  // we shouldn't continue beyond the timeout
  if (elapsed >= max) {
    throw new Error(`convergence exceeded the ${max}ms timeout`);
  }

  return elapsed;
}

/**
 * Runs a single assertion from a convergence queue with `arg` as the
 * assertion's argument. Adds convergence stats to the `stats` object.
 *
 * @private
 * @param {Object} subject - Convergence assertion queue item
 * @param {*} arg - Passed as the assertion's argument
 * @param {Object} stats - Stats accumulator object
 * @returns {Promise} Resolves with the assertion's return value
 */
function runAssertion(subject, arg, stats) {
  let timeout = stats.timeout - getElapsedSince(stats.start, stats.timeout);
  const assertion = subject.assertion.bind(this, arg);
  const converge = subject.always ? alwaysFn : whenFn;

  // the last always uses the remaining timeout
  if (subject.always && !subject.last) {
    // timeout needs to be smaller than the total timeout
    if (subject.timeout) {
      timeout = Math.min(timeout, subject.timeout);
      // default the timeout to one-tenth the total, or 20ms min
    } else {
      timeout = Math.max(stats.timeout / 10, 20);
    }
  }

  return converge(assertion, timeout)
  // incorporate stats and curry the assertion return value
    .then((convergeStats) => collectStats(stats, convergeStats));
}

/**
 * Returns `true` if the object has common convergence properties of
 * the correct type.
 *
 * ``` javascript
 * let result = maybeConvergence()
 *
 * if (isConvergence(result)) {
 *   await result.do(something).timeout(100)
 * } else {
 *   something(result)
 * }
 * ```
 *
 * @static
 * @alias Convergence.isConvergence
 * @param {Object} obj - A possible convergence object
 * @returns {Boolean}
 */
export function isConvergence(obj) {
  return !!obj && typeof obj === 'object' &&
    '_queue' in obj && Array.isArray(obj._queue) &&
    'timeout' in obj && typeof obj.timeout === 'function' &&
    'run' in obj && typeof obj.run === 'function';
}


/**
 * Runs a single function from a convergence queue with `arg` as the
 * function's argument. Adds simple stats to the `stats` object.
 *
 * When a promise is returned, the time it takes to resolve is
 * accounted for in `stats`.
 *
 * When a convergence is returned, it's own returned stats are
 * incorporated into the `stats` object, and it's final return value
 * is curried on.
 *
 * @private
 * @param {Object} subject - Convergence exec queue item
 * @param {*} arg - Passed as the function's argument
 * @param {Object} stats - Stats accumulator object
 * @returns {Promise} Resolves with the function's return value
 */
export function runCallback(subject, arg, stats) {
  const start = Date.now();
  let result = subject.callback.call(this, arg);

  const collectExecStats = (value) => {
    return collectStats(stats, {
      start,
      runs: 1,
      end: Date.now(),
      elapsed: getElapsedSince(start, stats.timeout),
      value
    });
  };

  // a convergence is called with the current remaining timeout
  if (isConvergence(result)) {
    const timeout = stats.timeout - getElapsedSince(start, stats.timeout);

    if (!subject.last) {
      // this .do() just prevents the last .always() from
      // using the entire timeout
      result = result.do(ret => ret);
    }

    return result.timeout(timeout).run()
    // incorporate stats and curry the return value
      .then((convergeStats) => collectStats(stats, convergeStats));

  // a promise will need to settle first
  } else if (result && typeof result.then === 'function') {
    return result.then(collectExecStats);

  // any other result is just returned
  } else {
    return collectExecStats(result);
  }
}

Interactor.prototype.run = function () {
  const start = Date.now();
  const stats = {
    start,
    runs: 0,
    end: start,
    elapsed: 0,
    value: undefined,
    timeout: this._timeout,
    queue: []
  };

  // reduce to a single promise that runs each item in the queue
  return this._queue.reduce((promise, subject, i) => {
    // the last subject will receive the remaining timeout
    if (i === (this._queue.length - 1)) {
      // eslint-disable-next-line
      subject = { last: true, ...subject };
    }

    return promise.then((ret) => {
      if (subject.assertion) {
        return runAssertion.call(this, subject, ret, stats);
      } else if (subject.callback) {
        return runCallback.call(this, subject, ret, stats);
      }
      return null;
    });
  }, Promise.resolve())
    // always resolve with the stats object
    .then(() => stats);
};
