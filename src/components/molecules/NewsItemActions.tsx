import React from "react";
import {
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

// Define NEWSACTION enum locally since it's only used in this file
enum NEWSACTION {
  REVIEWED = "REVIEWED",
  PUBLISHED = "PUBLISHED",
  REJECTED = "REJECTED",
}

interface NewsItemActionsProps {
  itemId: string;
  status: string;
  onAction: (id: string, action: NEWSACTION) => void;
  onReject: (e: React.MouseEvent, id: string) => void;
  isActionAllowed: (status: string, action: string) => boolean;
  getActionTooltip: (status: string, action: string) => string;
}

export const NewsItemActions: React.FC<NewsItemActionsProps> = ({
  itemId,
  status,
  onAction,
  onReject,
  isActionAllowed,
  getActionTooltip,
}) => {
  return (
    <div className="flex justify-end space-x-1">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onAction(itemId, NEWSACTION.REVIEWED);
        }}
        disabled={!isActionAllowed(status, "review")}
        className={`p-1.5 rounded transition-colors ${
          !isActionAllowed(status, "review")
            ? "opacity-50 cursor-not-allowed"
            : "text-blue-400 hover:bg-[#272ca6] hover:text-blue-300"
        }`}
        title={getActionTooltip(status, "review")}
      >
        <EyeIcon className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onAction(itemId, NEWSACTION.PUBLISHED);
        }}
        disabled={!isActionAllowed(status, "publish")}
        className={`p-1.5 rounded transition-colors ${
          !isActionAllowed(status, "publish")
            ? "text-gray-500 cursor-not-allowed"
            : "text-green-400 hover:bg-[#196645] hover:text-green-300"
        }`}
        title={getActionTooltip(status, "publish")}
      >
        <CheckCircleIcon className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={(e) => onReject(e, itemId)}
        disabled={!isActionAllowed(status, "reject")}
        className={`p-1.5 rounded transition-colors ${
          !isActionAllowed(status, "reject")
            ? "text-gray-500 cursor-not-allowed"
            : "text-red-400 hover:bg-[#7f1d1d] hover:text-red-300"
        }`}
        title={getActionTooltip(status, "reject")}
      >
        <XCircleIcon className="h-4 w-4" />
      </button>
    </div>
  );
};
