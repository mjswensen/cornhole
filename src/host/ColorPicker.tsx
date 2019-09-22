import React from 'react';

export enum Color {
  RED = 'red',
  ORANGE = 'orange',
  YELLOW = 'yellow',
  OLIVE = 'olive',
  GREEN = 'green',
  TEAL = 'teal',
  BLUE = 'blue',
  VIOLET = 'violet',
  PURPLE = 'purple',
  PINK = 'pink',
  BROWN = 'brown',
  GREY = 'grey',
  BLACK = 'black',
}

const ColorPicker: React.FC<{
  value: Color;
  onChange: (value: Color) => void;
}> = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={evt => onChange(evt.target.value as Color)}
      className="ui dropdown"
    >
      <option value={Color.RED}>Red</option>
      <option value={Color.ORANGE}>Orange</option>
      <option value={Color.YELLOW}>Yellow</option>
      <option value={Color.OLIVE}>Olive</option>
      <option value={Color.GREEN}>Green</option>
      <option value={Color.TEAL}>Teal</option>
      <option value={Color.BLUE}>Blue</option>
      <option value={Color.VIOLET}>Violet</option>
      <option value={Color.PURPLE}>Purple</option>
      <option value={Color.PINK}>Pink</option>
      <option value={Color.BROWN}>Brown</option>
      <option value={Color.GREY}>Grey</option>
      <option value={Color.BLACK}>Black</option>
    </select>
  );
};

export default ColorPicker;
