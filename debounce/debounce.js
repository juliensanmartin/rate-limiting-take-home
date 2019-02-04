export default function debounce(fn, time) {
  let currentTimeoutId;
  return () => {
    if (currentTimeoutId) clearTimeout(currentTimeoutId);

    currentTimeoutId = setTimeout(() => {
      currentTimeoutId = undefined;
      fn();
    }, time);
  };
}
