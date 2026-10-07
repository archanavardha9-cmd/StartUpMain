import React, { useRef } from 'react';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import Field from './Field';

const ImageUploader = ({
  label = 'Image',
  value = '',
  onChange,
  description = 'Upload or select an image.',
}) => {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    onChange(imageUrl);
  };

  const removeImage = () => {
    onChange('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <Field label={label} description={description}>
      <div className="space-y-3">
        {value ? (
          <div className="relative border-2 border-black rounded-xl overflow-hidden bg-[#F5F5F0]">
            <img
              src={value}
              alt="Selected"
              className="w-full h-48 object-cover"
            />

            <button
              type="button"
              onClick={removeImage}
              className="
                absolute top-3 right-3
                w-9 h-9
                flex items-center justify-center
                bg-white
                border-2 border-black
                rounded-lg
                hover:bg-[#FFDE4D]
                transition-all
              "
            >
              <X size={18} strokeWidth={3} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="
              w-full
              h-48
              border-2 border-dashed border-black
              rounded-xl
              bg-[#F5F5F0]
              flex flex-col items-center justify-center
              gap-3
              hover:bg-[#FFDE4D]
              transition-all
            "
          >
            <div className="w-12 h-12 bg-white border-2 border-black rounded-xl flex items-center justify-center">
              <ImageIcon size={24} />
            </div>

            <div className="text-center">
              <p className="text-sm font-black">
                Upload Image
              </p>
              <p className="text-xs font-semibold text-black/50 mt-1">
                PNG, JPG, WEBP
              </p>
            </div>
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />

        {value && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="
              flex items-center gap-2
              px-4 py-2.5
              border-2 border-black
              rounded-lg
              bg-white
              text-sm font-black
              hover:bg-[#FFDE4D]
              transition-all
            "
          >
            <Upload size={16} strokeWidth={3} />
            Change Image
          </button>
        )}
      </div>
    </Field>
  );
};

export default ImageUploader;