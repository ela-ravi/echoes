import React from "react";

interface TextAreaProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  className?: string;
  borderColor?: string;
  readOnly?: boolean;
  onViewFullContent?: () => void;
}

const TextArea: React.FC<TextAreaProps> = ({
  name,
  value,
  onChange,
  placeholder,
  className = "",
  borderColor = "var(--color-ui-border-light)",
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
        className={`form-input flex w-full min-w-0 flex-1 resize-none 
          overflow-hidden rounded-xl 
          ${
            readOnly
              ? "text-gray-400"
              : `text-[var(--color-text-primary)] 
                 hover:border-[2px] hover:border-[var(--color-ui-primary)]`
          } 
          focus:outline-0 focus:ring-0 
          border-solid border-[1px] border-[${borderColor}] bg-[var(--color-bg-card)] 
          focus:border-[2px] focus:border-[var(--color-ui-primary)] 
          min-h-36 placeholder:text-[var(--color-text-placeholder)] 
          p-4 text-base font-normal leading-normal 
          ${className}`}
        readOnly={readOnly}
        disabled={readOnly}
      />
    </div>
    {value && (
      <div className="flex justify-between items-center">
        <span className="text-sm text-[var(--color-text-placeholder)]">
          {value.length} characters
        </span>
        <button
          type="button"
          className="text-sm text-[var(--color-ui-primary)] hover:underline flex items-center gap-1"
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
