// Background colors
export const COLORS = {
  // Primary background colors
  background: {
    dark: "#0a0e17", // Main dark background
    card: "#1d2030", // Card backgrounds
    header: "#131520", // Header background
    input: "#2b2f40", // Input fields
    hover: "#2d3349", // Hover states
    modalOverlay: "rgba(0, 0, 0, 0.5)", // Modal overlay
  },

  // UI Colors
  ui: {
    primary: "#4f8ef7", // Primary action/button color
    primaryHover: "#3b7af5",
    danger: "#ef4444", // Error/danger color
    border: "#282d43", // Border color
    borderLight: "#394060", // Lighter border
  },

  // Text colors
  text: {
    primary: "#ffffff", // Main text
    secondary: "#99a2c2", // Secondary text
    placeholder: "#9da3be", // Placeholder text
  },

  // Button states
  button: {
    primary: "#4f8ef7",
    primaryHover: "#3b7af5",
    secondary: "#2a2f45",
    secondaryHover: "#394060",
    disabled: "#4a4f6b",
    danger: "#ef4444",
    dangerHover: "#dc2626",
  },

  // Status colors
  status: {
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  },
} as const;

export type ColorTheme = typeof COLORS;
