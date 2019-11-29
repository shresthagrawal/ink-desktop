import { useState, useEffect } from 'react';

export default function useTemporaryState(
  initialValue,
  delay,
  onReset = null
) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const tick = () => {
      setValue(initialValue);
      if (typeof onReset === 'function') {
        onReset();
      }
    };
    if (value !== initialValue) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [value]);

  return [value, setValue];
}
