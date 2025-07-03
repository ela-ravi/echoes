import React from "react";
import { AIStatus, ClientStatus } from "types/NewsItem";

interface StatusBadgeProps {
  status: AIStatus | ClientStatus;
  type?: "client" | "ai";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = "client",
}) => {
  const statusLower = status.toLowerCase();
  let badgeClass = "";

  if (type === "client") {
    if (statusLower === "published") {
      badgeClass =
        "bg-[var(--color-status-bg-published)] text-[var(--color-status-text-published)]";
    } else if (statusLower === "rejected") {
      badgeClass =
        "bg-[var(--color-status-bg-rejected)] text-[var(--color-status-text-rejected)]";
    } else if (statusLower === "submitted") {
      badgeClass =
        "bg-[var(--color-status-bg-submitted)] text-[var(--color-status-text-submitted)]";
    } else if (statusLower === "reviewed") {
      badgeClass =
        "bg-[var(--color-status-bg-reviewed)] text-[var(--color-status-text-reviewed)]";
    } else {
      // Default for Pending or any other status
      badgeClass =
        "bg-[var(--color-status-bg-pending)] text-[var(--color-status-text-pending)]";
    }
    badgeClass += " border border-[var(--color-ui-border)]";
  } else {
    // For AI status, use a simpler badge
    badgeClass = "bg-transparent text-[var(--color-text-primary)]";
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium font-bold ${badgeClass} whitespace-nowrap`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
