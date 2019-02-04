export default function throttle(fn, time){
  let canExecuteFn = true;
  return () => {
    if (canExecuteFn) {
      fn();
      canExecuteFn = false;
      setTimeout(() => {
        canExecuteFn = true;
      }, time);
    }
  };
}