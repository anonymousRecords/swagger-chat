import { forwardRef, TextareaHTMLAttributes, useEffect } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => {
  const adjustHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    if (ref && 'current' in ref && ref.current) {
      adjustHeight(ref.current);
    }
  }, [props.value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    adjustHeight(e.target);
    props.onChange(e);
  };

  return (
    <textarea
      ref={ref}
      {...props}
      onChange={handleChange}
      className="flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 px-4 py-2 focus:border-gray-500 focus:outline-none disabled:opacity-50"
    />
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
