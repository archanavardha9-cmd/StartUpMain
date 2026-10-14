import { useRef, useState } from 'react';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import Field from './Field';

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000'
).replace(/\/+$/, '');

const ImageUploader = ({
  label = 'Image',
  value = '',
  onChange,
  description = 'Upload or select an image.',
}) => {
  const inputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/cms/images`, {
        method: 'POST',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });
      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.url) {
        throw new Error(
          result?.message || `Unable to upload image (${response.status}).`
        );
      }

      onChange(new URL(result.url, API_BASE_URL).toString());
    } catch (error) {
      setUploadError(error.message || 'Unable to upload image.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
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
                {isUploading ? 'Uploading Image...' : 'Upload Image'}
              </p>
              <p className="text-xs font-semibold text-black/50 mt-1">
                PNG, JPG, WEBP (up to 8 MB)
              </p>
            </div>
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />

        {uploadError && (
          <p role="alert" className="text-sm font-semibold text-red-700">
            {uploadError}
          </p>
        )}

        {value && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="
              flex items-center gap-2
              px-4 py-2.5
              border-2 border-black
              rounded-lg
              bg-white
              text-sm font-black
              hover:bg-[#FFDE4D]
              transition-all
              disabled:cursor-wait disabled:opacity-60
            "
          >
            <Upload size={16} strokeWidth={3} />
            {isUploading ? 'Uploading...' : 'Change Image'}
          </button>
        )}
      </div>
    </Field>
  );
};

export default ImageUploader;