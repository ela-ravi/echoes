import React, { InputHTMLAttributes } from "react";
import styles from "./Input.module.scss";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  id: string;
  name?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, id, name, ...props }, ref) => {
    return (
      <div className={`${styles.inputWrapper} ${className}`}>
        {label && <label className={styles.label}>{label}</label>}
        <input
          ref={ref}
          id={id}
          name={name}
          className={`${styles.input} ${error ? styles.error : ""}`}
          {...props}
        />
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";
