import React from 'react';

const EditorActions = ({
  onSave,
  onReset,
  savedMessage = '',
}) => {
  return (
    <div className="sticky bottom-4 z-20">
      <div
        className="
          bg-black
          border-2 border-black
          rounded-2xl
          p-3 sm:p-4
          shadow-[5px_5px_0px_0px_rgba(0,0,0,0.25)]
        "
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            type="button"
            onClick={onSave}
            className="
              flex-1
              px-5 py-3
              bg-[#A3E635]
              border-2 border-black
              rounded-xl
              text-sm
              font-black
              text-black
              hover:-translate-y-0.5
              hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
              transition-all
            "
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={onReset}
            className="
              px-5 py-3
              bg-white
              border-2 border-black
              rounded-xl
              text-sm
              font-black
              text-black
              hover:bg-[#F472B6]
              hover:-translate-y-0.5
              transition-all
            "
          >
            Reset
          </button>
        </div>

        {savedMessage && (
          <p className="text-xs font-black text-white text-center mt-3">
            {savedMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default EditorActions;