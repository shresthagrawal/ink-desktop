import { useTransition } from 'react-spring';

export default function useFade(show, opts = {}) {
  const position = opts.position || 'absolute';
  const transform = opts.transform || true;

  return useTransition(show, null, {
    config: { duration: 125 },
    from: {
      position: position,
      opacity: 0,
      ...(transform && {
        transform: 'perspective(500px) translate3d(-4px, -4px, 10px)',
      }),
    },
    enter: {
      opacity: 1,
      ...(transform && {
        transform: 'perspective(500px) translate3d(0, 0, 0)',
      }),
    },
    leave: {
      opacity: 0,
      ...(transform && {
        transform: 'perspective(500px) translate3d(-4px, -4px, 10px)',
      }),
    },
  });
}
