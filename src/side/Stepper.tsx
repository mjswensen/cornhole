import React from 'react';
import classnames from 'classnames';

const Stepper: React.FC<{
  value: number;
  onChange: (value: number) => void;
  className?: string;
}> = ({ value, onChange, className }) => (
  <div className={classnames('text-2xl', className)}>
    <button
      className="bg-primary text-gray-0 inline-block rounded-full w-10 h-10"
      onClick={() => onChange(value - 1)}
    >
      -
    </button>
    <span className="mx-5">{value}</span>
    <button
      className="bg-primary text-gray-0 inline-block rounded-full w-10 h-10"
      onClick={() => onChange(value + 1)}
    >
      +
    </button>
  </div>
);

export default Stepper;
