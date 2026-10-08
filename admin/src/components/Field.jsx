import React from 'react';

const Field = ({
  label,
  description,
  children,
  required = false,
}) => {
  return (
    <div className="space-y-2">
      <div>
        <label className="block text-sm font-black text-black">
          {label}

          {required && (
            <span className="text-[#F97316] ml-1">*</span>
          )}
        </label>

        {description && (
          <p className="text-xs text-black/50 font-semibold mt-0.5">
            {description}
          </p>
        )}
      </div>

      {children}
    </div>
  );
};

export default Field;