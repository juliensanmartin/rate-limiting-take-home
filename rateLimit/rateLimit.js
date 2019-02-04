export default function rateLimit(fn, time) {
  let canExecuteFn = true;
  let executionQueue = [];

  const executeFn = () => {
    if (executionQueue.length > 0) {
      executionQueue[0]();
      executionQueue.splice(0, 1);
      canExecuteFn = false;
      setTimeout(() => {
        canExecuteFn = true;
        executeFn();
      }, time);
    }
  };

  return () => {
    executionQueue.push(fn);
    if (canExecuteFn) executeFn();
  };
}
