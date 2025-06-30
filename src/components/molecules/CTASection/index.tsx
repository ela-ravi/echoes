import React from "react";
import { Link } from "react-router-dom";
import { BackArrow } from "../../atoms/icons";

interface CTASectionProps {
  onSave: () => void;
  onDiscard: () => void;
  backLink: string;
  backText?: string;
  saveText?: string;
  discardText?: string;
  showBackButton?: boolean;
  showSaveButton?: boolean;
  showDiscardButton?: boolean;
  className?: string;
  hasChanges?: boolean;
}

const CTASection: React.FC<CTASectionProps> = ({
  onSave,
  onDiscard,
  backLink,
  backText = "Back to News",
  saveText = "Save Changes",
  discardText = "Discard Changes",
  showBackButton = true,
  showSaveButton = true,
  showDiscardButton = true,
  className = "",
  hasChanges = false,
}) => {
  return (
    <div
      className={`flex flex-col-reverse sm:flex-row justify-between gap-4 mt-6 p-4 border-t border-[#282d43] ${className}`}
    >
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        {showBackButton && (
          <Link
            to={backLink}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-transparent hover:bg-[#282d43] text-[#99a0c2] border border-[#394060] rounded-lg transition-colors lg:hidden"
          >
            <BackArrow />
            {backText}
          </Link>
        )}
        {showDiscardButton && (
          <button
            onClick={onDiscard}
            disabled={!hasChanges}
            className={`px-6 py-2 bg-transparent ${
              hasChanges
                ? "hover:bg-[#282d43] text-[#99a0c2] border-[#f87171] cursor-pointer"
                : "text-[#4a4f6b] border-[#2a2f45] cursor-not-allowed"
            } border rounded-lg transition-colors`}
          >
            {discardText}
          </button>
        )}
      </div>
      {showSaveButton && (
        <button
          onClick={onSave}
          disabled={!hasChanges}
          className={`px-6 py-2 rounded-lg transition-colors ${
            hasChanges
              ? "bg-[#4f8ef7] hover:bg-[#3b7af5] text-white cursor-pointer"
              : "bg-[#2a2f45] text-[#4a4f6b] cursor-not-allowed"
          }`}
        >
          {saveText}
        </button>
      )}
    </div>
  );
};

export default CTASection;
