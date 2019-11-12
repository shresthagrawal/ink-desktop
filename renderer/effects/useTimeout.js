import React, { useState, useEffect, useRef } from 'react';

// <https://overreacted.io/making-setinterval-declarative-with-react-hooks/>
export default function useTimeout(callback, delay) {
  const [beginTimeout, setBeginTimeout] = useState(false);
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null && beginTimeout) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay, beginTimeout]);

  return () => setBeginTimeout(true);
}
