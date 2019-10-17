import React from 'react';

const Stepper: React.FC<{
  value: number;
  onChange: (value: number) => void;
}> = ({ value, onChange }) => (
  <>
    <button className="btn btn-light" onClick={() => onChange(value - 1)}>
      -
    </button>
    {value}
    <button className="btn btn-light" onClick={() => onChange(value + 1)}>
      +
    </button>
  </>
);

export default Stepper;
