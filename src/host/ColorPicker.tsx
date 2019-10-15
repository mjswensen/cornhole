import React from 'react';
import { Color } from '../common/state';
import styles from './ColorPicker.module.css';

const ColorPicker: React.FC<{
  value: Color;
  onChange: (value: Color) => void;
}> = ({ value, onChange }) => {
  return (
    <select
      className={`form-control ${styles.select}`}
      value={value}
      onChange={evt => onChange(evt.target.value as Color)}
    >
      {Object.entries(Color).map(([key, value]) => (
        <option key={key} value={value}>
          {value}
        </option>
      ))}
    </select>
  );
};

export default ColorPicker;
