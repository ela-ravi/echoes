import React from "react";
import { FaTimesCircle } from "react-icons/fa";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  onRejectClick?: (e: React.MouseEvent) => void;
}

const Section: React.FC<SectionProps> = ({
  title,
  children,
  onRejectClick,
}) => (
  <div className="mb-6">
    <div className="flex items-center mb-2">
      <h2 className="text-[var(--color-text-primary)] text-[22px] font-bold leading-tight tracking-[-0.015em]">
        {title}
      </h2>
      {title === "Potential Risks" && (
        <button
          className="text-red-500 hover:text-red-400 transition-colors ml-4"
          onClick={onRejectClick}
          title="Reject news item"
        >
          <FaTimesCircle className="h-5 w-5" />
        </button>
      )}
    </div>
    {children}
  </div>
);

export default Section;
