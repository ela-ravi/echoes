import React from "react";

interface BadgeProps {
  className?: string;
  children: React.ReactNode;
  fullText?: boolean; // New prop to control truncation
}

const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  fullText = false,
}) => {
  const text = String(children);
  const displayText =
    !fullText && text.length > 23 ? `${text.substring(0, 20)}...` : text;

  return (
    <span
      className={`inline-flex items-center bg-[var(--color-badge-bg)] text-[var(--color-badge-text)] text-bold text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap ${className}`}
      title={!fullText && text !== displayText ? text : undefined}
    >
      {displayText}
    </span>
  );
};

export default Badge;
