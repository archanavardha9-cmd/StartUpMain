import React from 'react';

const TextInput = ({
  value = '',
  onChange,
  placeholder = '',
  type = 'text',
  disabled = false,
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="
        w-full
        px-3.5 py-3
        bg-white
        border-2 border-black
        rounded-xl
        text-sm
        font-semibold
        text-black
        outline-none
        placeholder:text-black/30
        focus:bg-[#FFFDF9]
        focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
        transition-all
        disabled:bg-black/5
        disabled:cursor-not-allowed
      "
    />
  );
};

export default TextInput;