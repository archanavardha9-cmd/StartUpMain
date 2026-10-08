import React from 'react';
import Field from './Field';

const TypographyControls = ({
  value = {},
  onChange,
}) => {
  const update = (key, newValue) => {
    onChange({
      ...value,
      [key]: newValue,
    });
  };

  return (
    <div className="space-y-5">

      {/* Font Family */}
      <Field
        label="Font Family"
        description="Choose the typeface used for this content."
      >
        <select
          value={value.fontFamily || 'Inter'}
          onChange={(e) =>
            update('fontFamily', e.target.value)
          }
          className="w-full px-3.5 py-3 bg-white border-2 border-black rounded-xl text-sm font-bold outline-none focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
        >
          <option value="Inter">Inter</option>
          <option value="Arial">Arial</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">
            Times New Roman
          </option>
          <option value="Verdana">Verdana</option>
          <option value="Trebuchet MS">
            Trebuchet MS
          </option>
        </select>
      </Field>

      {/* Font Size */}
      <Field
        label="Font Size"
        description="Set the text size in pixels."
      >
        <div className="flex gap-3">
          <input
            type="number"
            min="8"
            max="120"
            value={value.fontSize ?? 16}
            onChange={(e) =>
              update('fontSize', Number(e.target.value))
            }
            className="flex-1 px-3.5 py-3 bg-white border-2 border-black rounded-xl text-sm font-bold outline-none focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          />

          <div className="px-4 py-3 bg-[#F5F5F0] border-2 border-black rounded-xl font-black text-sm">
            px
          </div>
        </div>
      </Field>

      {/* Font Weight */}
      <Field label="Font Weight">
        <select
          value={value.fontWeight || 700}
          onChange={(e) =>
            update('fontWeight', Number(e.target.value))
          }
          className="w-full px-3.5 py-3 bg-white border-2 border-black rounded-xl text-sm font-bold outline-none focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
        >
          <option value="300">Light — 300</option>
          <option value="400">Regular — 400</option>
          <option value="500">Medium — 500</option>
          <option value="600">Semibold — 600</option>
          <option value="700">Bold — 700</option>
          <option value="800">Extra Bold — 800</option>
          <option value="900">Black — 900</option>
        </select>
      </Field>

      {/* Line Height */}
      <Field
        label="Line Height"
        description="Control the vertical spacing between lines."
      >
        <input
          type="number"
          min="0.8"
          max="3"
          step="0.1"
          value={value.lineHeight ?? 1.5}
          onChange={(e) =>
            update('lineHeight', Number(e.target.value))
          }
          className="w-full px-3.5 py-3 bg-white border-2 border-black rounded-xl text-sm font-bold outline-none focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
        />
      </Field>

      {/* Letter Spacing */}
      <Field
        label="Letter Spacing"
        description="Adjust the space between individual characters."
      >
        <div className="flex gap-3">
          <input
            type="number"
            min="-5"
            max="20"
            step="0.1"
            value={value.letterSpacing ?? 0}
            onChange={(e) =>
              update(
                'letterSpacing',
                Number(e.target.value)
              )
            }
            className="flex-1 px-3.5 py-3 bg-white border-2 border-black rounded-xl text-sm font-bold outline-none focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          />

          <div className="px-4 py-3 bg-[#F5F5F0] border-2 border-black rounded-xl font-black text-sm">
            px
          </div>
        </div>
      </Field>

    </div>
  );
};

export default TypographyControls;