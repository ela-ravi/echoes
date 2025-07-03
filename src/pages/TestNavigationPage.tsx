import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HeaderNav from "../components/organisms/HeaderNav";

const TestNavigationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [newsId, setNewsId] = useState("");

  return (
    <div className="min-h-screen bg-[var(--color-bg-dark)] text-[var(--color-text-primary)]">
      <HeaderNav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Test Navigation</h1>

        <div className="mb-8 p-6 bg-[var(--color-bg-header)] rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Current Location:</h2>
          <pre className="bg-black p-4 rounded overflow-x-auto">
            {JSON.stringify(location, null, 2)}
          </pre>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Navigation Card */}
          <div className="bg-[var(--color-bg-card)] p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold mb-3">News List</h3>
            <p className="text-gray-400 mb-4">
              Navigate to the main news list page
            </p>
            <Link
              to="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-[var(--color-text-primary)] px-4 py-2 rounded transition-colors"
            >
              Go to News List
            </Link>
          </div>

          {/* Navigation Card */}
          <div className="bg-[var(--color-bg-card)] p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold mb-3">News Detail</h3>
            <p className="text-gray-400 mb-4">
              Test navigation to a specific news item
            </p>
            <Link
              to="/news-detail?id=test-news-1"
              className="inline-block bg-green-600 hover:bg-green-700 text-[var(--color-text-primary)] px-4 py-2 rounded transition-colors"
            >
              View Test News
            </Link>
          </div>

          {/* Navigation Card */}
          <div className="bg-[var(--color-bg-card)] p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold mb-3">External Link</h3>
            <p className="text-gray-400 mb-4">Test opening an external URL</p>
            <a
              href="https://example.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-[var(--color-text-primary)] px-4 py-2 rounded transition-colors"
            >
              Open External Site
            </a>
          </div>
        </div>

        <div className="mt-12 p-6 bg-[var(--color-bg-card)] rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Navigation Tester</h2>
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Enter news ID"
              className="px-4 py-2 bg-[var(--color-bg-header)] border border-[var(--color-ui-border-light)] rounded text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newsId}
              onChange={(e) => setNewsId(e.target.value)}
            />
            <button
              onClick={() => {
                const idToNavigate = newsId.trim() || "test-news-1";
                navigate(
                  `/news-detail?id=${encodeURIComponent(idToNavigate)}`,
                  { replace: true },
                );
              }}
              className="bg-blue-600 hover:bg-blue-700 text-[var(--color-text-primary)] px-4 py-2 rounded text-center transition-colors"
            >
              Navigate to News ID
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestNavigationPage;
