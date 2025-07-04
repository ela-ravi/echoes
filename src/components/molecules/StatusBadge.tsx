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
      badgeClass = "bg-green-900/30 text-green-400";
    } else if (statusLower === "rejected") {
      badgeClass = "bg-red-900/30 text-red-400";
    } else if (statusLower === "submitted") {
      badgeClass = "bg-[#282d43] text-white";
    } else if (statusLower === "reviewed") {
      badgeClass = "bg-[#1d2030] text-[#4f8ef7]";
    } else {
      // Default for Pending or any other status
      badgeClass = "bg-yellow-900/30 text-yellow-400";
    }
  } else {
    // For AI status, use a simpler badge
    badgeClass = "bg-transparent text-white";
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${badgeClass} whitespace-nowrap`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
