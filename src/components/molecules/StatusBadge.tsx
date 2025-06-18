import React from "react";
import Badge from "../atoms/Badge";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <Badge>{status}</Badge>
);

export default StatusBadge;
