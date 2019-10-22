import React from 'react';
import classnames from 'classnames';

const Button: React.FC<{
  disabled?: boolean;
  onClick: () => void;
  secondary?: boolean;
  className?: string;
}> = ({ disabled, onClick, secondary, className, children }) => (
  <button
    className={classnames(
      'border-2',
      secondary ? 'border-gray-7' : 'border-primary',
      'py-3',
      'px-4',
      secondary ? 'text-gray-7' : 'text-primary',
      'rounded',
      'transition',
      secondary ? 'hover:bg-gray-7' : 'hover:bg-primary',
      'hover:text-gray-0',
      { 'opacity-50': disabled },
      className,
    )}
    {...{ disabled, onClick }}
  >
    {children}
  </button>
);

export default Button;
