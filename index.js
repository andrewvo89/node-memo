const cache = new Map();

/**
 * Runs an expensive function and memoizes the result based on the deps array.
 * @param {*} fn
 * @param {*} args
 * @return {*}
 */
function runMemo(fn, args) {
  if (typeof fn !== "function") {
    throw new Error("fn must be a function");
  }

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

  // runA: Cache miss
  console.time("runA");
  const resultA = runMemo(expensiveFn, [initialValue]);
  console.timeEnd("runA");

  // runB: Cache hit
  console.time("runB");
  const resultB = runMemo(expensiveFn, [initialValue]);
  console.timeEnd("runB");

  // runC: Change the initialValue to emulate a cache miss
  console.time("runC");
  const resultC = runMemo(expensiveFn, [anotherInitialValue]);
  console.timeEnd("runC");

  console.log("resultA", resultA);
  console.log("resultB", resultB);
  console.log("resultC", resultC);
}

run();
