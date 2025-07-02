// Background colors
export const COLORS = {
  // Primary background colors
  background: {
    dark: "var(--color-bg-dark)", // Main dark background
    card: "var(--color-bg-card)", // Card backgrounds
    header: "var(--color-bg-header)", // Header background
    input: "var(--color-bg-input)", // Input fields
    hover: "var(--color-bg-hover)", // Hover states
    modalOverlay: "var(--color-bg-modal-overlay)", // Modal overlay
  },

  // UI Colors
  ui: {
    primary: "var(--color-ui-primary)", // Primary action/button color
    primaryHover: "var(--color-ui-primary-hover)",
    danger: "var(--color-ui-danger)", // Error/danger color
    border: "var(--color-ui-border)", // Border color
    borderLight: "var(--color-ui-border-light)", // Lighter border
  },

  // Text colors
  text: {
    // primary: "#ffffff", // Main text
    primary: "var(--color-text-primary)", // Main text
    secondary: "var(--color-text-secondary)", // Secondary text
    placeholder: "var(--color-text-placeholder)", // Placeholder text
  },

  // Button states
  button: {
    primary: "var(--color-ui-primary)",
    primaryHover: "var(--color-ui-primary-hover)",
    secondary: "var(--color-ui-secondary)",
    secondaryHover: "var(--color-ui-secondary-hover)",
    disabled: "var(--color-ui-disabled)",
    danger: "var(--color-ui-danger)",
    dangerHover: "var(--color-button-danger-hover)",
  },

  // Status colors
  status: {
    success: "var(--color-status-success)",
    warning: "var(--color-status-warning)",
    error: "var(--color-ui-danger)",
    info: "var(--color-status-info)",
  },
} as const;

export type ColorTheme = typeof COLORS;
