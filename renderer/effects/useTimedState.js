import { useState, useEffect } from 'react';

export default function useTimedState(initialValue, delay) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const tick = () => setValue(initialValue);
    if (value !== initialValue) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [value]);

  return [value, setValue];
}
