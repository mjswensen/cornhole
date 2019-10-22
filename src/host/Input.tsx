import React from 'react';

const Input: React.FC<{
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ placeholder, value, onChange }) => (
  <input
    type="text"
    className="w-full p-1 bg-gray-0 placeholder-gray-3 text-gray-7 rounded-sm"
    placeholder={placeholder}
    value={value}
    onChange={evt => onChange(evt.target.value)}
  />
);

export default Input;
