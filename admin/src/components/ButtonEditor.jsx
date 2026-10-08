import React from 'react';
import Field from './Field';
import TextInput from './TextInput';
import ColorControl from './ColorControl';

const ButtonEditor = ({
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
      <Field label="Button Text">
        <TextInput
          value={value.text || ''}
          onChange={(newValue) =>
            update('text', newValue)
          }
          placeholder="Book a Seat"
        />
      </Field>

      <Field
        label="Button Link"
        description="Where should this button take the visitor?"
      >
        <TextInput
          value={value.href || ''}
          onChange={(newValue) =>
            update('href', newValue)
          }
          placeholder="#booking-form"
        />
      </Field>

      <div className="grid grid-cols-1 gap-5">
        <ColorControl
          label="Background Color"
          value={value.backgroundColor || '#FFDE4D'}
          onChange={(newValue) =>
            update('backgroundColor', newValue)
          }
        />

        <ColorControl
          label="Text Color"
          value={value.textColor || '#000000'}
          onChange={(newValue) =>
            update('textColor', newValue)
          }
        />
      </div>

      <Field label="Border Radius">
        <div className="flex gap-3">
          <input
            type="number"
            min="0"
            max="100"
            value={value.borderRadius ?? 12}
            onChange={(e) =>
              update(
                'borderRadius',
                Number(e.target.value)
              )
            }
            className="
              flex-1
              px-3.5 py-3
              bg-white
              border-2 border-black
              rounded-xl
              text-sm font-bold
              outline-none
              focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
            "
          />

          <div className="px-4 py-3 bg-[#F5F5F0] border-2 border-black rounded-xl font-black text-sm">
            px
          </div>
        </div>
      </Field>

      <Field label="Button Width">
        <select
          value={value.width || 'auto'}
          onChange={(e) =>
            update('width', e.target.value)
          }
          className="
            w-full
            px-3.5 py-3
            bg-white
            border-2 border-black
            rounded-xl
            text-sm font-bold
            outline-none
            focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
          "
        >
          <option value="auto">Auto</option>
          <option value="full">Full Width</option>
        </select>
      </Field>
    </div>
  );
};

export default ButtonEditor;