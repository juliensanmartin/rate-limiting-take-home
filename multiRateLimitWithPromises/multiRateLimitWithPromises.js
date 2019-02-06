export default function multiRateLimitWithPromises(fn, time, numInWindow) {
  let windowLeft = numInWindow;
  let executionQueue = [];

  const  executeFn = resolve => {
    if (executionQueue.length > 0) {
      const { fn, args } = executionQueue[0];
      executionQueue.splice(0, 1);
      windowLeft = windowLeft - 1;
      setTimeout(() => {
        if (windowLeft > 0) executeFn(resolve);
      }, time);
      return fn(...args)
      .then(response => {
        windowLeft = windowLeft + 1;
        resolve(response);
      })
    }
  };

  return (...args) => {
    return new Promise((resolve, reject) => {
      executionQueue.push({ fn, args });
      if (windowLeft > 0) executeFn(resolve);
    });
  };
}
