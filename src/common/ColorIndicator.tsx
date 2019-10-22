import React from 'react';
import classnames from 'classnames';
import { Color } from './state';

const ColorIndicator: React.FC<{ color: Color; className?: string }> = ({
  color,
  className,
}) => (
  <span
    className={classnames(
      `bg-bags-${color}`,
      'inline-block',
      'w-6',
      'h-6',
      'border',
      'border-gray-6',
      'rounded-sm',
      className,
    )}
  />
);

export default ColorIndicator;
