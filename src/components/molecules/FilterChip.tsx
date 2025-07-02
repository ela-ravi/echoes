import React from "react";

interface FilterChipProps {
  label: string;
}

const FilterChip: React.FC<FilterChipProps> = ({ label }) => (
  <button className="flex items-center gap-x-2 rounded-full bg-[var(--color-ui-border)] px-4 py-1.5 text-sm font-medium text-[var(--color-text-primary)]">
    {label}
  </button>
);

export default FilterChip;
