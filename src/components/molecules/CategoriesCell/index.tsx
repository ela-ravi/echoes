import React, { useState, useMemo } from "react";
import ContentModal from "../ContentModal";

type CategoriesCellProps = {
  categories: string[];
};

const CategoriesCell: React.FC<CategoriesCellProps> = ({ categories = [] }) => {
  const [showModal, setShowModal] = useState(false);
  const hasManyCategories = useMemo(() => categories.length > 2, [categories]);

  const toggleModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal(!showModal);
  };

  // If there are no categories, return null or some placeholder
  if (categories.length === 0) {
    return <span className="text-gray-400 text-sm">No categories</span>;
  }

  return (
    <div className="flex items-center">
      <div className="flex flex-wrap gap-2 items-center">
        {/* Always show the first two categories */}
        {categories.slice(0, 2).map((cat) => (
          <span
            key={cat}
            className="inline-flex items-center rounded-full bg-[#282d43] px-4 py-1 text-xs font-medium text-white"
          >
            {cat}
          </span>
        ))}
        {/* Show +X more button if there are more than 2 categories */}
        {hasManyCategories && (
          <button
            type="button"
            onClick={toggleModal}
            className="text-xs text-blue-400 hover:underline ml-1"
            aria-label={`Show all ${categories.length} categories`}
          >
            +{categories.length - 2} more
          </button>
        )}
      </div>

      {/* Modal to show all categories */}
      {showModal && (
        <ContentModal
          title="All Categories"
          content={categories.join("\n")}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default CategoriesCell;
