/**
 * Runs an expensive function and memoizes the result based on the deps array.
 * @param {*} fn
 * @param {*} args
 * @return {*}
 */
function runMemo(fn) {
  if (typeof fn !== "function") {
    throw new Error("fn must be a function");
  }

  const cache = new Map();

  return function (...args) {
    if (!Array.isArray(args)) {
      throw new Error("args must be an array");
    }

    const key = JSON.stringify({
      fn: fn.toString(),
      args: args.map((arg) => arg.toString()),
    });

    const keyExists = cache.has(key);

    if (keyExists) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);

    return result;
  };
}

/**
 * Runs an expensive function.
 * @param {*} initialValue
 * @return {*}
 */
function expensiveFn(initialValue) {
  let sum = initialValue;
  for (let i = 0; i < 5555555555; i++) {
    sum += i;
  }
  return sum;
}

/**
 * Runs the example.
 */
function run() {
  const initialValue = 11111;
  const anotherInitialValue = 22222;

  const fnRunner = runMemo(expensiveFn);

  // runA: Cache miss
  console.time("runA");
  const resultA = fnRunner(initialValue);
  console.timeEnd("runA");

  // runB: Cache hit
  console.time("runB");
  const resultB = fnRunner(initialValue);
  console.timeEnd("runB");

  // runC: Change the initialValue to emulate a cache miss
  console.time("runC");
  const resultC = fnRunner(anotherInitialValue);
  console.timeEnd("runC");

  console.log("resultA", resultA);
  console.log("resultB", resultB);
  console.log("resultC", resultC);
}

run();
