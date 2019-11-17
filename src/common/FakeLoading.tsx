import React, { useState } from 'react';
import Loading from './Loading';
import { useAnimationFrame } from './useAnimationFrame';

const FakeLoading: React.FC<{ className?: string }> = ({ className }) => {
  const [progress, setProgress] = useState(0);
  useAnimationFrame(deltaTime => {
    setProgress(prevProgress =>
      Math.min(prevProgress + deltaTime / 45000, 0.95),
    );
  });
  return <Loading className={className} progress={progress} />;
};

export default FakeLoading;
