const cache = new Map();

/**
 * Runs an expensive function and memoizes the result based on the deps array.
 * @param {*} fn
 * @param {*} args
 * @return {*}
 */
function runMemo(fn, args) {
  if (typeof fn !== "function") {
    throw new Error("expensiveFn must be a function");
  }

  if (!Array.isArray(args)) {
    throw new Error("args must be an array");
  }

  const argsSerialized = args.map((arg) => arg.toString()).join("");
  const fnSerialized = fn.toString();
  const key = `${fnSerialized}${argsSerialized}`;

  const cacheHit = cache.get(key);
  if (cacheHit) {
    return cacheHit;
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

  // runD: Change the initialValue to emulate a cache miss
  console.time("runD");
  const resultD = runMemo(expensiveFn, [anotherInitialValue]);
  console.timeEnd("runD");

  console.log("resultA", resultA);
  console.log("resultB", resultB);
  console.log("resultD", resultD);
}

run();
