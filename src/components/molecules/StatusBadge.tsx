import React from "react";

interface StatusBadgeProps {
  status?: string;
  type?: "client" | "ai";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status = "Pending",
  type = "client",
}) => {
  const statusLower = status?.toLowerCase() || "pending";
  let badgeClass = "";

  if (type === "client") {
    if (statusLower === "trusted") {
      badgeClass = "bg-green-900/30 text-green-400";
    } else if (statusLower === "fake") {
      badgeClass = "bg-red-900/30 text-red-400";
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
