import React, { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.scss";

type ButtonVariant = "primary" | "secondary" | "text" | "outline";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  isLoading?: boolean;
  fullWidth?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      isLoading = false,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const buttonClass = `${styles.button} ${
      isLoading ? styles.loading : ""
    } ${fullWidth ? styles.fullWidth : ""} ${className}`.trim();

    return (
      <button
        ref={ref}
        className={buttonClass}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <span className={styles.spinner} />}
        <span className={styles.content}>{children}</span>
      </button>
    );
  },
);

Button.displayName = "Button";
