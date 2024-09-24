import {type RefObject, useEffect} from 'react';

export const useOnClickOutside = <T extends HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }

      handler(event);
    };

    window.addEventListener('mousedown', listener);
    window.addEventListener('touchstart', listener);

    return () => {
      console.log('cleanup useClickOutside');
      window.removeEventListener('mousedown', listener);
      window.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};
