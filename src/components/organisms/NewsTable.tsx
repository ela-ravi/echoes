import { Link } from "react-router-dom";
import React, { useState } from "react";
import StatusBadge from "../molecules/StatusBadge";
import CategoriesCell from "../molecules/CategoriesCell";
import RejectModal from "../molecules/RejectModal";
import { NewsItemActions } from "../molecules/NewsItemActions";
import type { INewsList } from "../../types/NewsItem";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { useAIRefresh } from "../../hooks/useAIRefresh";
import { NewsReviewAction, newsService } from "../../services/newsService";

// Define NEWSACTION enum locally since it's only used in this file
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
  onUpdate?: () => void;
}

const NewsTable: React.FC<NewsTableProps> = ({ items, onUpdate }) => {
  // Get user type from sessionStorage
  const userType =
    typeof window !== "undefined" ? sessionStorage.getItem("userType") : null;
  const isClient = userType === "CLIENT";
  const isAdmin = userType === "ADMIN";
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState("");

  const newsDetailRoute = (id: string) =>
    isAdmin ? `/news-detail?id=${id}` : `/client-news-detail?id=${id}`;

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

  const { isRefreshing: isGlobalRefreshing, handleAIRefresh } = useAIRefresh();
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

  const handleRefreshClick = async (id: string) => {
    try {
      setRefreshingItems((prev) => ({ ...prev, [id]: true }));
      await handleAIRefresh(
        id,
        onUpdate
          ? async () => {
              if (onUpdate) {
                await onUpdate();
              }
            }
          : undefined
      );
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
    comment?: string
  ) => {
    try {
      // Map NEWSACTION to NewsReviewAction
      const reviewAction =
        action === NEWSACTION.REVIEWED
          ? NewsReviewAction.APPROVE
          : action === NEWSACTION.REJECTED
            ? NewsReviewAction.REJECT
            : NewsReviewAction.PENDING;

      await newsService.reviewNewsItem(id, reviewAction, comment);

      // Refresh the news list
      if (onUpdate) {
        await onUpdate();
      }

      // Show success message
      toast.success(`News item ${action.toLowerCase()} successfully`);
    } catch (error) {
      console.error(`Error ${action.toLowerCase()}ing news item:`, error);
      toast.error(
        `Failed to ${action.toLowerCase()} news item: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <div
      className={`overflow-x-auto rounded-xl border border-[${isAdmin ? "#394060" : "#603939"}] bg-[${isAdmin ? "#131520" : "#201313"}] my-4`}
    >
      <table className="w-full text-sm text-white">
        <thead>
          <tr className={`bg-[${isAdmin ? "#1d2030" : "#301d1d"}] text-left`}>
            <th className="px-4 py-3 w-[160px]">News ID</th>
            <th className="px-4 py-3">Title</th>
            {isAdmin && <th className="px-4 py-3">User</th>}
            <th className="px-4 py-3">Categories</th>
            <th className="px-4 py-3">Similar Source</th>
            <th className="px-4 py-3 whitespace-nowrap">Published At</th>
            {isAdmin && <th className="px-4 py-3">AI Status</th>}
            <th className="px-4 py-3">
              {isAdmin ? "Client Status" : "Status"}
            </th>
            {isClient && <th className="px-4 py-3 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className={`border-t border-[${isAdmin ? "#394060" : "#603939"}] ${isAdmin ? "hover:bg-[#1d2030]/50" : "hover:bg-[#301d1d]/50"}`}
            >
              <td className="px-4 py-2 font-medium tracking-wide w-[160px]">
                <Link
                  to={newsDetailRoute(item.id)}
                  onClick={(e) => {
                    // Prevent default to handle navigation programmatically
                    e.preventDefault();
                    // Add a small delay to ensure the click is processed
                    setTimeout(() => {
                      window.location.href = newsDetailRoute(item.id);
                    }, 100);
                  }}
                  className="text-[#4f8ef7] hover:underline"
                >
                  {item.id}
                </Link>
              </td>
              <td className="px-4 py-2 truncate max-w-xs">{item.title}</td>
              {isAdmin && (
                <td className="px-4 py-2 whitespace-nowrap">
                  {item.submittedBy || "N/A"}
                </td>
              )}
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
              {isAdmin && (
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={item.aiStatus} type="ai" />
                    {(item.aiStatus === "IN_PROGRESS" ||
                      item.aiStatus === "FAILED") && (
                      <button
                        type="button"
                        onClick={() => handleRefreshClick(item.id.toString())}
                        disabled={
                          refreshingItems[item.id] || isGlobalRefreshing
                        }
                        className={`text-gray-400 hover:text-blue-400 transition-colors ${
                          refreshingItems[item.id] || isGlobalRefreshing
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        title={
                          refreshingItems[item.id] || isGlobalRefreshing
                            ? "Refreshing..."
                            : "Refresh AI status"
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
              )}
              <td className="px-4 py-2">
                <StatusBadge status={item.clientStatus} />
              </td>
              {isClient && (
                <td className="px-4 py-2">
                  <NewsItemActions
                    itemId={item.id}
                    status={item.clientStatus}
                    onAction={handleAction}
                    onReject={handleRejectClick}
                    isActionAllowed={isActionAllowed}
                    getActionTooltip={getActionTooltip}
                  />
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
