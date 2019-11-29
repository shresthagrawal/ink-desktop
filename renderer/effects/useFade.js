import { useTransition } from 'react-spring';

export default function useFade(show, positionAbsolute = true) {
  return useTransition(show, null, {
    from: {
      position: positionAbsolute ? 'absolute' : 'static',
      opacity: 0,
      transform: 'translate3d(0,-10px,0)',
    },
    enter: { opacity: 1, transform: 'translate3d(0,0px,0)' },
    leave: { opacity: 0, transform: 'translate3d(0,10px,0)' },
  });
}
