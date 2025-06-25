import React from "react";
import { Input } from "../atoms/Input";
import { Select } from "../atoms/Select";
import { Button } from "../atoms/Button";
import styles from "../../pages/NewsListPage.module.scss";

import { NewsFilterKey, NewsFiltersType } from "../../pages/NewsListPage";

interface NewsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: Omit<NewsFiltersType, "search">;
  onFilterChange: (key: NewsFilterKey, value: string) => void;
  onResetFilters: () => void;
  isResetDisabled?: boolean;
}

const NewsFilters: React.FC<NewsFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  onResetFilters,
  isResetDisabled = false,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full sm:grid sm:grid-cols-2 sm:gap-4 lg:flex lg:flex-row">
      <div className="w-full">
        <div className={styles.searchWrapper}>
          <div className="relative">
            <Input
              id="search-news"
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={`${styles.selectWrapper} w-full`}>
        <Select
          value={filters.category || "all"}
          onChange={(e) => onFilterChange("category", e.target.value)}
          options={[
            { value: "all", label: "All Categories" },
            { value: "finance", label: "Finance" },
            { value: "business", label: "Business" },
            { value: "crime", label: "Crime" },
            { value: "entertainment", label: "Entertainment" },
            { value: "events", label: "Events" },
            { value: "health", label: "Health" },
            { value: "law", label: "Law" },
            { value: "local", label: "Local" },
            { value: "politics", label: "Politics" },
            { value: "real-estate", label: "Real Estate" },
            { value: "sports", label: "Sports" },
            { value: "technology", label: "Technology" },
            { value: "weather", label: "Weather" },
            { value: "world", label: "World" },
          ]}
        />
      </div>

      <div className={`${styles.selectWrapper} w-full`}>
        <Select
          value={filters.status || "all"}
          onChange={(e) => onFilterChange("status", e.target.value)}
          options={[
            { value: "all", label: "All Status" },
            { value: "SUBMITTED", label: "SUBMITTED" },
            { value: "PENDING", label: "PENDING" },
            { value: "REVIEWED", label: "REVIEWED" },
            { value: "PUBLISHED", label: "PUBLISHED" },
            { value: "REJECTED", label: "REJECTED" },
          ]}
        />
      </div>

      <div className="w-full lg:w-auto">
        <Button
          variant="outline"
          onClick={onResetFilters}
          disabled={isResetDisabled}
          className={`w-full ${
            isResetDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default NewsFilters;
