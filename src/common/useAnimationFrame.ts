import { useEffect, useRef, useCallback } from 'react';

export function useAnimationFrame(cb: (delta: number) => void) {
  const frame = useRef<number | undefined>();
  const previous = useRef(performance.now());

  const animate = useCallback(
    (time: number) => {
      cb(time - previous.current);
      previous.current = time;
      frame.current = requestAnimationFrame(animate);
    },
    [cb],
  );

  useEffect(() => {
    frame.current = requestAnimationFrame(animate);
    return () => {
      frame.current !== undefined && cancelAnimationFrame(frame.current);
    };
  }, [animate]);
}
