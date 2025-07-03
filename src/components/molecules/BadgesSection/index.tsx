import React from "react";

interface BadgesSectionProps {
  badges: Record<string, number>;
}

const BadgesSection: React.FC<BadgesSectionProps> = ({ badges }) => {
  console.log("Badges:", badges);
  return (
    <div>
      <p className="text-xs text-[var(--color-badge-text)]-500 font-medium mb-1">
        BADGES
      </p>
      <div className="flex flex-wrap gap-2">
        {Object.entries(badges).map(([badgeType, count]) => (
          <div
            key={badgeType}
            className="flex items-center space-x-1 bg-[var(--color-badge-bg)] px-2 py-1 rounded-md"
          >
            <img
              src={`/assets/${badgeType.toLowerCase()}.png`}
              alt={`${badgeType} badge`}
              className="w-5 h-5 object-contain"
            />
            <span className="text-xs text-[var(--color-badge-text)] font-bold  capitalize">
              {badgeType.toLowerCase()} ({count})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgesSection;
