import { Link } from "react-router-dom";
import React, { useState } from "react";
import StatusBadge from "../molecules/StatusBadge";
import Badge from "../atoms/Badge";
import { INewsItem } from "../../types/NewsItem";

interface CategoriesCellProps {
  categories: string[];
}

const CategoriesCell: React.FC<CategoriesCellProps> = ({ categories }) => {
  const [open, setOpen] = useState(false);
  const visible = open ? categories || [] : (categories || []).slice(0, 2);
  const hiddenCount = (categories?.length || 0) - visible.length;

  return (
    <div className="relative flex flex-wrap gap-1 items-center max-w-[200px]">
      {visible.map((cat) => (
        <Badge key={cat}>{cat}</Badge>
      ))}
      {!open && hiddenCount > 0 && (
        <button
          type="button"
          aria-label="Show categories"
          onClick={() => setOpen(true)}
          className="text-white"
        >
          <svg
            className="size-4"
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
        <div className="absolute left-0 top-full mt-2 z-10 rounded-lg bg-[#1d2030] p-3 shadow-lg max-w-xs">
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <Badge key={cat}>{cat}</Badge>
            ))}
          </div>
          <button
            type="button"
            aria-label="Hide categories"
            onClick={() => setOpen(false)}
            className="mt-2 text-[#4f8ef7] hover:underline text-sm"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

interface NewsTableProps {
  items: INewsItem[];
}

const NewsTable: React.FC<NewsTableProps> = ({ items }) => (
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
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} className="border-t border-[#394060]">
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
            <td className="px-4 py-2 whitespace-nowrap">{item.publishedAt}</td>
            <td className="px-4 py-2">
              <StatusBadge status={item.aiStatus} type="ai" />
            </td>
            <td className="px-4 py-2">
              <StatusBadge status={item.clientStatus} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default NewsTable;
