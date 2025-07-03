import React, { ReactNode } from "react";
import { FaSync } from "react-icons/fa";
import CategoriesCell from "../CategoriesCell";

type AIStatus = "FAILED" | "IN_PROGRESS" | "COMPLETED";

interface UserInfoItemBaseProps {
  label: string;
  children?: ReactNode;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  status?: AIStatus;
}

interface UserInfoItemWithContentProps extends UserInfoItemBaseProps {
  content: ReactNode;
  timestamp?: never;
  userName?: never;
  fallbackText?: never;
  rewardPoints?: never;
  categories?: never;
  status?: never;
}

interface UserInfoItemWithUserProps extends UserInfoItemBaseProps {
  userName?: string | null;
  timestamp?: string | null;
  fallbackText?: string;
  content?: never;
  rewardPoints?: never;
  categories?: never;
  status?: never;
}

interface UserInfoItemWithRewardPoints extends UserInfoItemBaseProps {
  rewardPoints: number;
  content?: never;
  timestamp?: never;
  userName?: never;
  fallbackText?: never;
  categories?: never;
  status?: never;
}

interface UserInfoItemWithCategories extends UserInfoItemBaseProps {
  categories: string[];
  content?: never;
  timestamp?: never;
  userName?: never;
  fallbackText?: never;
  rewardPoints?: never;
  status?: never;
}

interface UserInfoItemWithStatus extends UserInfoItemBaseProps {
  status: AIStatus;
  content?: never;
  timestamp?: never;
  userName?: never;
  fallbackText?: never;
  rewardPoints?: never;
  categories?: never;
}

type UserInfoItemProps =
  | UserInfoItemWithContentProps
  | UserInfoItemWithUserProps
  | UserInfoItemWithRewardPoints
  | UserInfoItemWithCategories
  | UserInfoItemWithStatus;

const UserInfoItem: React.FC<UserInfoItemProps> = ({
  label,
  userName,
  timestamp,
  fallbackText = "N/A",
  content,
  rewardPoints,
  categories,
  status,
  onRefresh,
  isRefreshing = false,
}) => {
  const renderContent = () => {
    if (content) return content;
    if (rewardPoints !== undefined) {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-[var(--color-reward-text)]">
            {rewardPoints}
          </span>
          <span className="text-xs text-gray-400">points</span>
        </div>
      );
    }
    if (categories) {
      return (
        <div className="flex flex-wrap gap-2">
          <CategoriesCell categories={categories} />
        </div>
      );
    }
    if (status !== undefined) {
      return (
        <div className="flex justify-between items-start">
          <p className="text-sm text-gray-400">{status || fallbackText}</p>
          {/* {(status === "FAILED" || status === "IN_PROGRESS") && onRefresh && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRefresh();
              }}
              disabled={isRefreshing}
              className={`text-gray-400 hover:text-blue-400 transition-colors ml-2 ${
                isRefreshing ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="Refresh status"
            >
              <FaSync
                className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>
          )} */}
        </div>
      );
    }
    return (
      <>
        <p className="text-sm text-gray-400">{userName || fallbackText}</p>
        {timestamp && (
          <p className="text-xs text-gray-500">
            {new Date(timestamp).toLocaleString()}
          </p>
        )}
      </>
    );
  };

  return (
    <div>
      <div className="flex items-center">
        <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
        {status !== undefined && onRefresh && (
          <div className="ml-2">
            {(status === "FAILED" || status === "IN_PROGRESS") && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRefresh();
                }}
                disabled={isRefreshing}
                className={`text-gray-400 hover:text-blue-400 transition-colors ${
                  isRefreshing ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title="Refresh status"
              >
                <FaSync
                  className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </button>
            )}
          </div>
        )}
      </div>
      <div className="space-y-1">{renderContent()}</div>
    </div>
  );
};

export default UserInfoItem;
