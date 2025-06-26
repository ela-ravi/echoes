import React from "react";
import Badge from "../atoms/Badge";

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: (e: React.MouseEvent) => void;
  categories: string[];
}

const CategoriesModal: React.FC<CategoriesModalProps> = ({
  isOpen,
  onClose,
  categories = [],
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-[#1d2030] rounded-lg p-4 max-w-sm w-full mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">Categories</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Badge key={cat} fullText={true}>
              {cat}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesModal;
