import React from 'react';
import { Color } from './state';
import styles from './ColorIndicator.module.css';

function getClassName(color: Color): string {
  switch (color) {
    case Color.BLUE:
      return 'badge badge-primary';
    case Color.GRAY:
      return 'badge badge-secondary';
    case Color.GREEN:
      return 'badge badge-success';
    case Color.RED:
      return 'badge badge-danger';
    case Color.YELLOW:
      return 'badge badge-warning';
    case Color.TEAL:
      return 'badge badge-info';
    case Color.WHITE:
      return 'badge badge-light';
    case Color.BLACK:
      return 'badge badge-dark';
  }
}

const ColorIndicator: React.FC<{ color: Color; className?: string }> = ({
  color,
  className,
}) => (
  <span className={`${styles.indicator} ${getClassName(color)} ${className}`}>
    {color}
  </span>
);

export default ColorIndicator;
