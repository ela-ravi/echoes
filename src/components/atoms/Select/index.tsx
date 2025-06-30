import React, { SelectHTMLAttributes } from "react";
import styles from "./Select.module.scss";

type Option = {
  value: string;
  label: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options: Option[];
  label?: string;
  error?: string;
  containerClass?: string;
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className = "", label, options, error, containerClass, ...props },
    ref,
  ) => {
    return (
      <div className={`${styles.selectWrapper} ${containerClass}`}>
        {label && <label className={styles.label}>{label}</label>}
        <select
          ref={ref}
          className={`${styles.select} ${className} ${error ? styles.error : ""}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  },
);

Select.displayName = "Select";
