import React, { useState } from "react";
import Badge from "../atoms/Badge";
import TagModal from "./TagModal";

interface TagCellProps {
  tags: string[];
  maxVisible?: number;
  className?: string;
  type?: "publishedBy" | "rejectedBy" | "categories";
}

const TagCell: React.FC<TagCellProps> = ({
  tags = [],
  maxVisible = 2,
  className = "",
  type,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const visible = tags.slice(0, maxVisible);
  const hiddenCount = Math.max(0, tags.length - maxVisible);

  const handleShowAllTags = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hiddenCount > 0) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(false);
  };

  const handleBadgeClick = (e: React.MouseEvent, isTruncated: boolean) => {
    if (isTruncated) {
      e.stopPropagation();
      setIsModalOpen(true);
    }
  };

  if (!tags || tags.length === 0) {
    return <div className={`text-sm text-gray-400 ${className}`}>-</div>;
  }

  return (
    <div
      className={`relative flex flex-wrap items-center max-w-[200px] ${className}`}
    >
      <div className="flex flex-wrap gap-1 items-center">
        {visible.map((tag) => {
          const isTruncated = tag.length > 23;
          return (
            <div
              key={tag}
              className={`mb-1 ${isTruncated ? "cursor-pointer" : ""}`}
              onClick={(e) => handleBadgeClick(e, isTruncated)}
            >
              <Badge className={isTruncated ? "hover:bg-[#3a3f5a]" : ""}>
                {tag}
              </Badge>
            </div>
          );
        })}
        {hiddenCount > 0 && (
          <button
            type="button"
            onClick={handleShowAllTags}
            className="text-xs text-gray-400 hover:text-white"
          >
            +{hiddenCount} more
          </button>
        )}
      </div>
      <TagModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        tags={tags}
        type={type}
      />
    </div>
  );
};

export default TagCell;
