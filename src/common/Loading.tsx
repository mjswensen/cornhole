import React from 'react';
import classnames from 'classnames';

const Loading: React.FC<{ progress: number; className?: string }> = ({
  progress,
  className,
}) => (
  <span
    className={classnames(
      'h-1',
      'rounded',
      'bg-gray-2',
      'inline-block',
      'w-40',
      'relative',
      className,
    )}
  >
    <span
      className="h-1 rounded bg-primary absolute left-0 top-0"
      style={{ width: `${progress * 100}%` }}
    />
  </span>
);

export default Loading;
