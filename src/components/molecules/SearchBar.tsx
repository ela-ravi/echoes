import React from "react";
import Icon from "../atoms/Icon";

interface SearchBarProps {
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Search" }) => (
  <label className="flex w-full">
    <span className="flex items-center justify-center rounded-l-xl bg-[var(--color-ui-border)] px-4 text-[#99a0c2]">
      <Icon size={20}>
        <path d="M229.66 218.34L179.6 168.28a88.11 88.11 0 10-11.32 11.32l50.06 50.06a8 8 0 1011.32-11.32zM40 112a72 72 0 1172 72 72.08 72.08 0 01-72-72z" />
      </Icon>
    </span>
    <input
      type="search"
      placeholder={placeholder}
      className="flex-1 rounded-r-xl bg-[var(--color-ui-border)] px-4 text-[var(--color-text-primary)] placeholder:text-[#99a0c2] focus:outline-none"
    />
  </label>
);

export default SearchBar;
