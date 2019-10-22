import React from 'react';
import classnames from 'classnames';

const Button: React.FC<{
  disabled: boolean;
  onClick: () => void;
}> = ({ disabled, onClick, children }) => (
  <button
    className={classnames(
      'border-2',
      'border-primary',
      'py-3',
      'px-4',
      'text-primary',
      'rounded',
      'transition',
      'hover:bg-primary',
      'hover:text-gray-0',
      { 'opacity-50': disabled },
    )}
    {...{ disabled, onClick }}
  >
    {children}
  </button>
);

export default Button;
