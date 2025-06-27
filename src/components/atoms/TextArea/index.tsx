import React from "react";

interface TextAreaProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  className?: string;
  readOnly?: boolean;
  onViewFullContent?: () => void;
}

const TextArea: React.FC<TextAreaProps> = ({
  name,
  value,
  onChange,
  placeholder,
  className = "",
  readOnly = false,
  onViewFullContent,
}) => (
  <div className="flex flex-col gap-2 py-3">
    <div className="flex flex-1">
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border border-[#394060] bg-[#1d2030] focus:border-[#4f8ef7] min-h-36 placeholder:text-[#99a2c2] p-4 text-base font-normal leading-normal ${className}`}
        readOnly={readOnly}
      />
    </div>
    {value && (
      <div className="flex justify-between items-center">
        <span className="text-sm text-[#99a2c2]">
          {value.length} characters
        </span>
        <button
          type="button"
          className="text-sm text-[#4f8ef7] hover:underline flex items-center gap-1"
          onClick={onViewFullContent}
          disabled={!onViewFullContent}
        >
          View full content
        </button>
      </div>
    )}
  </div>
);

export default TextArea;
