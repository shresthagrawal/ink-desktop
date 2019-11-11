import { useTransition } from 'react-spring';

export default function useFade(show) {
  return useTransition(show, null, {
    from: {
      position: 'absolute',
      opacity: 0,
      transform: 'translate3d(0,-10px,0)',
    },
    enter: { opacity: 1, transform: 'translate3d(0,0px,0)' },
    leave: { opacity: 0, transform: 'translate3d(0,10px,0)' },
  });
}
