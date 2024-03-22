const cache = new Map();

/**
 * Runs an expensive function and memoizes the result based on the deps array.
 * @param {*} fn
 * @param {*} args
 * @param {*} deps
 * @return {*}
 */
function runMemo(fn, args, deps) {
  if (!Array.isArray(deps)) {
    throw new Error("Key must be an array");
  }

  if (typeof fn !== "function") {
    throw new Error("expensiveFn must be a function");
  }

  if (!Array.isArray(args)) {
    throw new Error("args must be an array");
  }

  const key = deps
    .map((dep) => dep.toString())
    .sort()
    .join("");

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
  const resultA = runMemo(
    expensiveFn,
    [initialValue],
    [expensiveFn, initialValue]
  );
  console.timeEnd("runA");

  // runB: Cache hit
  console.time("runB");
  const resultB = runMemo(
    expensiveFn,
    [initialValue],
    [expensiveFn, initialValue]
  );
  console.timeEnd("runB");

  // runC: Switch the order of the deps array and the result is the same as runB
  console.time("runC");
  const resultC = runMemo(
    expensiveFn,
    [initialValue],
    [initialValue, expensiveFn]
  );
  console.timeEnd("runC");

  // runD: Change the initialValue to emulate a cache miss
  console.time("runD");
  const resultD = runMemo(
    expensiveFn,
    [anotherInitialValue],
    [expensiveFn, anotherInitialValue]
  );
  console.timeEnd("runD");
  console.log("resultA", resultA);
  console.log("resultB", resultB);
  console.log("resultC", resultC);
  console.log("resultD", resultD);
}

run();
