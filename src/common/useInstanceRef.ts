import { MutableRefObject, useRef } from 'react';

export default function useInstanceRef<T>(factory: () => T): T {
  const ref: MutableRefObject<T | null> = useRef(null);
  function getRef(): T {
    if (ref.current === null) {
      ref.current = factory();
    }
    return ref.current;
  }
  return getRef();
}
