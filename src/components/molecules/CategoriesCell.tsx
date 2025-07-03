import React, { useState } from "react";
import Badge from "../atoms/Badge";
import TagModal from "./TagModal";

interface CategoriesCellProps {
  categories: string[];
}

const CategoriesCell: React.FC<CategoriesCellProps> = ({ categories = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const maxVisible = 2;
  const visible = categories.slice(0, maxVisible);
  const hiddenCount = Math.max(0, categories.length - maxVisible);

  const handleShowAllCategories = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hiddenCount > 0) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleBadgeClick = (e: React.MouseEvent, isTruncated: boolean) => {
    if (isTruncated) {
      e.stopPropagation();
      setIsModalOpen(true);
    }
  };

  return (
    <div className="relative flex flex-wrap items-center max-w-[200px]">
      <div className="flex flex-wrap gap-1 items-center">
        {visible.map((cat) => {
          const isTruncated = cat.length > 23;
          return (
            <div
              key={cat}
              className={`mb-1 ${isTruncated ? "cursor-pointer" : ""}`}
              onClick={(e) => handleBadgeClick(e, isTruncated)}
            >
              <Badge className={isTruncated ? "hover:bg-[#3a3f5a]" : ""}>
                {cat}
              </Badge>
            </div>
          );
        })}
        {hiddenCount > 0 && (
          <button
            type="button"
            aria-label={`Show all ${hiddenCount} more categories`}
            onClick={handleShowAllCategories}
            className="flex items-center justify-center h-5 w-6 text-xs text-gray-400 hover:text-[var(--color-text-primary)] rounded mb-1"
          >
            +{hiddenCount}
          </button>
        )}
      </div>

      <TagModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        tags={categories}
        type="categories"
      />
    </div>
  );
};

export default CategoriesCell;
