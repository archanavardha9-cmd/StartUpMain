import React from 'react';
import Field from './Field';

const ColorControl = ({
  label,
  value = '#000000',
  onChange,
}) => {
  return (
    <Field label={label}>
      <div className="flex gap-3">

        <div className="relative w-14 h-12 shrink-0">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div
            className="w-full h-full border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            style={{
              backgroundColor: value,
            }}
          />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 px-3.5 py-3 bg-white border-2 border-black rounded-xl text-sm font-mono font-bold uppercase outline-none focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
        />

      </div>
    </Field>
  );
};

export default ColorControl;