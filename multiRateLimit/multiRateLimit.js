export default function multiRateLimit(fn, time, numInWindow) {
  let windowLeft = numInWindow;
  let executionQueue = [];

  const executeFn = () => {
    if (executionQueue.length > 0) {
      executionQueue[0]();
      executionQueue.splice(0, 1);
      windowLeft = windowLeft - 1;
      setTimeout(() => {
        windowLeft = windowLeft + 1;
        executeFn();
      }, time);
    }
  };

  return () => {
    executionQueue.push(fn);
    if (windowLeft > 0) executeFn();
  };
}