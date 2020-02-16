import { useEffect } from 'react';

const containsRefs = (refs, target) =>
  refs.some(ref => !ref.current || ref.current.contains(target));

// <https://usehooks.com/useOnClickOutside/>
// use useCallback(handler) to optimize performance
export default function useOnClickOutside(ref, handler, excludeRefs = []) {
  useEffect(() => {
    const listener = event => {
      if (containsRefs([ref, ...excludeRefs], event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
