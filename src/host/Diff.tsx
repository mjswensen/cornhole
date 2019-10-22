import React from 'react';

const Diff: React.FC<{ diff: number; bust: boolean; className: string }> = ({
  diff,
  bust,
  className,
}) =>
  diff > 0 ? (
    <span
      className={`${
        bust
          ? 'bg-danger-background text-danger-foreground'
          : 'bg-success-background text-success-foreground'
      } py-px px-1 rounded-sm ${className}`}
    >
      +{diff}
      {bust ? ' BUST' : ''}
    </span>
  ) : null;

export default Diff;
