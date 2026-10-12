import React from "react";
import Field from "./Field";

const ColorControl = ({ label, value = "#000000", onChange }) => {
  return (
    <Field label={label}>
      <div className="flex w-full min-w-0 max-w-full items-center gap-2">
        {/* Color Picker Button */}
        <div className="relative h-12 w-10 shrink-0 sm:w-12">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
          />

          <div
            className="h-full w-full rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            style={{
              backgroundColor: value,
            }}
          />
        </div>

        {/* Hex Color Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="block h-12 w-0 min-w-0 flex-1 rounded-xl border-2 border-black bg-white px-2 sm:px-3 text-xs sm:text-sm font-mono font-bold uppercase outline-none focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
        />
      </div>
    </Field>
  );
};

export default ColorControl;