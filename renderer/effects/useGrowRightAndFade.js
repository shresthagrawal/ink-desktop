import { useTransition } from 'react-spring';

export default function useGrowRightAndFade(show, opts = {}) {
  const maxWidth = opts.maxWidth || 50;
  const marginRight = opts.marginRight || 10;
  return useTransition(show, null, {
    config: {
      duration: 125,
    },
    from: {
      maxWidth: 0,
      marginRight: 0,
      opacity: 0,
    },
    enter: [{ maxWidth, marginRight }, { opacity: 1 }],
    leave: [{ opacity: 0 }, { maxWidth: 0, marginRight: 0 }],
  });
}
