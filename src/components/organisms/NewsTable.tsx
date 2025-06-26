import { Link } from "react-router-dom";
import React, { useState } from "react";
import StatusBadge from "../molecules/StatusBadge";
import CategoriesCell from "../molecules/CategoriesCell";
import RejectModal from "../molecules/RejectModal";
import type { INewsList } from "../../types/NewsItem";
import {
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { API_ENDPOINTS } from "../../config/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// export type NewsAction = "REVIEWED" | "PUBLISHED" | "REJECTED";
enum NEWSACTION {
  REVIEWED = "REVIEWED",
  PUBLISHED = "PUBLISHED",
  REJECTED = "REJECTED",
}

export interface NewsActionPayload {
  id: string;
  action: NEWSACTION;
  comment?: string;
}

interface NewsTableProps {
  items: INewsList[];
  showActions?: boolean;
  onUpdate?: () => void;
}

const NewsTable: React.FC<NewsTableProps> = ({
  items,
  showActions = true,
  onUpdate,
}) => {
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState("");

  const isActionAllowed = (status: string, actionType: string) => {
    switch (status) {
      case "PENDING":
        return actionType === "review";
      case "REVIEWED":
        return actionType === "publish" || actionType === "reject";
      case "PUBLISHED":
      case "REJECTED":
      case "SUBMITTED":
        return false;
      default:
        return true; // Default to allowing actions if status is not recognized
    }
  };

  const getActionTooltip = (status: string, actionType: string) => {
    if (!isActionAllowed(status, actionType)) {
      switch (status) {
        case "PENDING":
          return "Only Start Review action is allowed for PENDING items";
        case "REVIEWED":
          return "Only Publish and Reject actions are allowed for REVIEWED items";
        case "PUBLISHED":
          return "No actions allowed for PUBLISHED items";
        case "REJECTED":
          return "No actions allowed for REJECTED items";
        case "SUBMITTED":
          return "No actions allowed for SUBMITTED items";
        default:
          return "Action not allowed";
      }
    }
    return actionType === "review"
      ? "Mark as Reviewed"
      : actionType === "publish"
        ? "Publish"
        : "Reject";
  };

  const [refreshingItems, setRefreshingItems] = useState<
    Record<string, boolean>
  >({});

  const handleRejectClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedItemId(id);
    setRejectComment("");
    setRejectModalOpen(true);
  };

  const handleRejectSubmit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedItemId) return;

    await handleAction(selectedItemId, NEWSACTION.REJECTED, rejectComment);
    setRejectModalOpen(false);
    setRejectComment("");
    setSelectedItemId(null);
  };

  const handleCloseRejectModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRejectModalOpen(false);
  };
  const handleAIRefresh = async (id: string) => {
    try {
      setRefreshingItems((prev) => ({ ...prev, [id]: true }));
      const response = await fetch(API_ENDPOINTS.NEWS.AI_RETRY(id), {
        method: "GET",
        headers: {
          accept: "*/*",
          "ngrok-skip-browser-warning": "true",
          "client-key": "admin",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to refresh AI status");
      }

      toast.success("AI refresh initiated");
      // Trigger parent to refresh data
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error refreshing AI status:", error);
      toast.error("Failed to refresh AI status");
    } finally {
      setRefreshingItems((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleAction = async (
    id: string,
    action: NEWSACTION,
    comment?: string,
  ) => {
    try {
      const url = new URL(API_ENDPOINTS.NEWS.REVIEW(id));
      url.searchParams.append("reviewerId", "2"); // Replace with actual reviewer ID
      url.searchParams.append("status", action);

      // Add comment to query params if it's a rejection and comment exists
      if (action === NEWSACTION.REJECTED && comment?.trim()) {
        url.searchParams.append("comment", comment.trim());
      }

      const response = await fetch(url.toString(), {
        method: "POST",
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        headers: {
          "ngrok-skip-browser-warning": true,
          "Content-Type": "application/json",
          "client-key": "admin",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} news item`);
      }

      toast.success(`Successfully ${action} news item`);
      onUpdate?.(); // Refresh the news list
    } catch (error) {
      console.error(`Error ${action}ing news item:`, error);
      toast.error(`Failed to ${action} news item`);
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-[#394060] bg-[#131520] my-4">
      <table className="w-full text-sm text-white">
        <thead>
          <tr className="bg-[#1d2030] text-left">
            <th className="px-4 py-3 w-[160px]">News ID</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Categories</th>
            <th className="px-4 py-3">Similar Source</th>
            <th className="px-4 py-3 whitespace-nowrap">Published At</th>
            <th className="px-4 py-3">AI Status</th>
            <th className="px-4 py-3">Client Status</th>
            {showActions && <th className="px-4 py-3 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-t border-[#394060] hover:bg-[#1d2030]/50"
            >
              <td className="px-4 py-2 font-medium tracking-wide w-[160px]">
                <Link
                  to={`/news-detail?id=${item.id}`}
                  onClick={(e) => {
                    // Prevent default to handle navigation programmatically
                    e.preventDefault();
                    // Add a small delay to ensure the click is processed
                    setTimeout(() => {
                      window.location.href = `/news-detail?id=${item.id}`;
                    }, 100);
                  }}
                  className="text-[#4f8ef7] hover:underline"
                >
                  {item.id}
                </Link>
              </td>
              <td className="px-4 py-2 truncate max-w-xs">{item.title}</td>
              <td className="px-4 py-2 max-w-[220px]">
                <CategoriesCell categories={item.categories || []} />
              </td>
              <td className="px-4 py-2 truncate max-w-[200px]">
                {item.similarSourceUrl ? (
                  <a
                    href={item.similarSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#4f8ef7] hover:underline"
                  >
                    {item.similarSourceName || "View Source"}
                  </a>
                ) : (
                  <span className="text-gray-400">No similar source</span>
                )}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {item.publishedAt}
              </td>
              <td className="px-4 py-2">
                <div className="flex items-center gap-2">
                  <StatusBadge status={item.aiStatus} type="ai" />
                  {(item.aiStatus === "IN_PROGRESS" ||
                    item.aiStatus === "FAILED") && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAIRefresh(item.id);
                      }}
                      disabled={refreshingItems[item.id]}
                      className={`text-gray-400 hover:text-white ${
                        refreshingItems[item.id] ||
                        (item.aiStatus !== "FAILED" &&
                          item.aiStatus !== "IN_PROGRESS" &&
                          !isActionAllowed(item.clientStatus, "review"))
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:text-blue-400"
                      }`}
                      title={
                        refreshingItems[item.id]
                          ? "Refreshing..."
                          : item.aiStatus === "FAILED" ||
                              item.aiStatus === "IN_PROGRESS"
                            ? "Refresh AI status"
                            : getActionTooltip(item.clientStatus, "review")
                      }
                    >
                      <ArrowPathIcon
                        className={`w-4 h-4 ${
                          refreshingItems[item.id] ? "animate-spin" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>
              </td>
              <td className="px-4 py-2">
                <StatusBadge status={item.clientStatus} />
              </td>
              {showActions && (
                <td className="px-4 py-2">
                  <div className="flex justify-end space-x-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(item.id, NEWSACTION.REVIEWED);
                      }}
                      disabled={!isActionAllowed(item.clientStatus, "review")}
                      className={`p-1.5 rounded transition-colors ${
                        !isActionAllowed(item.clientStatus, "review")
                          ? "opacity-50 cursor-not-allowed"
                          : "text-blue-400 hover:bg-blue-900/50 hover:text-blue-300"
                      }`}
                      title={getActionTooltip(item.clientStatus, "review")}
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(item.id, NEWSACTION.PUBLISHED);
                      }}
                      disabled={!isActionAllowed(item.clientStatus, "publish")}
                      className={`p-1.5 rounded transition-colors ${
                        !isActionAllowed(item.clientStatus, "publish")
                          ? "text-gray-500 cursor-not-allowed"
                          : "text-green-400 hover:bg-green-900/50 hover:text-green-300"
                      }`}
                      title={getActionTooltip(item.clientStatus, "publish")}
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleRejectClick(e, item.id)}
                      disabled={!isActionAllowed(item.clientStatus, "reject")}
                      className={`p-1.5 rounded transition-colors ${
                        !isActionAllowed(item.clientStatus, "reject")
                          ? "text-gray-500 cursor-not-allowed"
                          : "text-red-400 hover:bg-red-900/50 hover:text-red-300"
                      }`}
                      title={getActionTooltip(item.clientStatus, "reject")}
                    >
                      <XCircleIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <RejectModal
        isOpen={rejectModalOpen}
        onClose={handleCloseRejectModal}
        onReject={handleRejectSubmit}
        comment={rejectComment}
        onCommentChange={(e) => setRejectComment(e.target.value)}
      />
    </div>
  );
};

// Export the NewsAction type separately to avoid duplicate export
export default NewsTable;
