import { Link } from "react-router-dom";
import React, { useState } from "react";
import StatusBadge from "../molecules/StatusBadge";
import Badge from "../atoms/Badge";
import { INewsList } from "../../types/NewsItem";
import {
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { API_ENDPOINTS } from "../../config/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CategoriesCellProps {
  categories: string[];
}

const CategoriesCell: React.FC<CategoriesCellProps> = ({ categories }) => {
  const [open, setOpen] = useState(false);
  const visible = open ? categories || [] : (categories || []).slice(0, 2);
  const hiddenCount = (categories?.length || 0) - visible.length;

  const handleShowAllCategories = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(true);
  };

  return (
    <div className="relative flex flex-wrap gap-1 items-center max-w-[200px]">
      {visible.map((cat) => (
        <Badge key={cat}>{cat}</Badge>
      ))}
      {!open && hiddenCount > 0 && (
        <button
          type="button"
          aria-label="Show all categories"
          onClick={handleShowAllCategories}
          className="text-white hover:bg-[#2d3349] p-1 rounded"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#1d2030] rounded-lg p-4 max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">Categories</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Badge key={cat}>{cat}</Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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
  const handleAction = async (id: string, action: NEWSACTION) => {
    try {
      const url = new URL(API_ENDPOINTS.NEWS.REVIEW(id));
      url.searchParams.append("reviewerId", "1"); // Replace with actual reviewer ID
      url.searchParams.append("status", action);
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
    <div className="overflow-x-auto rounded-xl border border-[#394060] bg-[#131520]">
      <table className="w-full text-sm text-white">
        <thead>
          <tr className="bg-[#1d2030] text-left">
            <th className="px-4 py-3 w-[160px]">News ID</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Categories</th>
            <th className="px-4 py-3">Similar Source</th>
            <th className="px-4 py-3">Published At</th>
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
                <StatusBadge status={item.aiStatus} type="ai" />
              </td>
              <td className="px-4 py-2">
                <StatusBadge status={item.clientStatus} />
              </td>
              {showActions && (
                <td className="px-4 py-2">
                  <div className="flex justify-end space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(item.id, NEWSACTION.REVIEWED);
                      }}
                      // disabled={isProcessing(item.id)}
                      className={`p-1.5 rounded transition-colors ${
                        // isProcessing(item.id)
                        // ? "text-gray-500 cursor-not-allowed"
                        "text-blue-400 hover:bg-blue-900/50 hover:text-blue-300"
                      }`}
                      title="Start Review"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(item.id, NEWSACTION.PUBLISHED);
                      }}
                      // disabled={isProcessing(item.id)}
                      className={`p-1.5 rounded transition-colors ${
                        // isProcessing(item.id)
                        // ? "text-gray-500 cursor-not-allowed"
                        "text-green-400 hover:bg-green-900/50 hover:text-green-300"
                      }`}
                      title="Publish"
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(item.id, NEWSACTION.REJECTED);
                      }}
                      // disabled={isProcessing(item.id)}
                      className={`p-1.5 rounded transition-colors ${
                        // isProcessing(item.id)
                        // ? "text-gray-500 cursor-not-allowed"
                        "text-red-400 hover:bg-red-900/50 hover:text-red-300"
                      }`}
                      title="Reject"
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
    </div>
  );
};

// Export the NewsAction type separately to avoid duplicate export
export default NewsTable;
