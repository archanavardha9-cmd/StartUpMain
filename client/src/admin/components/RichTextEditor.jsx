import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const RichTextEditor = ({
  value = '',
  onChange,
  placeholder = 'Start writing...',
}) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!editorRef.current || quillRef.current) {
      return;
    }

    const quill = new Quill(editorRef.current, {
      theme: 'snow',
      placeholder,
      modules: {
        toolbar: [
          [
            {
              header: [1, 2, 3, 4, 5, 6, false],
            },
          ],
          ['bold', 'italic', 'underline', 'strike'],
          [
            {
              color: [],
            },
            {
              background: [],
            },
          ],
          [
            {
              align: [],
            },
          ],
          [
            {
              list: 'ordered',
            },
            {
              list: 'bullet',
            },
          ],
          ['blockquote', 'link'],
          ['clean'],
        ],
      },
    });

    quillRef.current = quill;

    if (value) {
      quill.root.innerHTML = value;
    }

    const handleTextChange = () => {
      onChangeRef.current?.(quill.root.innerHTML);
    };

    quill.on('text-change', handleTextChange);

    return () => {
      quill.off('text-change', handleTextChange);
      quillRef.current = null;
    };
  }, []);

  return (
    <div className="admin-rich-editor border-2 border-black rounded-xl overflow-hidden bg-white">
      <div ref={editorRef} />
    </div>
  );
};

export default RichTextEditor;