import React from 'react';
import { Color } from '../common/state';
import { theme } from '../tailwind.config';

const image = `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path
    d="M3.5 5.5L8 2L12.5 5.5M3.5 10.5L8 14L12.5 10.5"
    stroke="${theme.colors.gray[7]}"
    stroke-width="1.5"
    stroke-linejoin="round"
    stroke-linecap="round"
  />
</svg>`;

const ColorPicker: React.FC<{
  value: Color;
  onChange: (value: Color) => void;
}> = ({ value, onChange }) => {
  return (
    <select
      className="appearance-none bg-gray-0 capitalize w-20 p-1 text-gray-7 rounded-sm"
      style={{
        backgroundImage: `url(data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
          image,
        )})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '1em',
        backgroundPosition: 'right 0.25em center',
      }}
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
