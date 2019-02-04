export default function multiRateLimitWithPromises(fn, time, numInWindow) {
  let windowLeft = numInWindow;
  let executionQueue = [];

  const  executeFn = resolve => {
    if (executionQueue.length > 0) {
      const { fn, args } = executionQueue[0];
      //const result = fn(...args);
      executionQueue.splice(0, 1);
      windowLeft = windowLeft - 1;
      setTimeout(() => {
        windowLeft = numInWindow;
        executeFn(resolve);
      }, time);
      resolve(fn(...args));
    }
  };

  return (...args) => {
    return new Promise((resolve, reject) => {
      executionQueue.push({ fn, args });
      if (windowLeft > 0) executeFn(resolve);
    });
  };
}
