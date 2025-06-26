// Using json-server as our mock API
const API_BASE_URL = process.env.SERVER_APP_BASE_URL || "http://localhost:3001";
const API_ENDPOINT_NEWS_LIST =
  process.env.API_ENDPOINT_NEWS_LIST || "admin-news-list";
const API_ENDPOINT_NEWS_DETAIL =
  process.env.API_ENDPOINT_NEWS_DETAILS || "admin-news-details";
const API_ENDPOINT_NEWS_UPDATE =
  process.env.API_ENDPOINT_NEWS_UPDATE || "admin-update-news";
const API_ENDPOINT_NEWS_REVIEW =
  process.env.API_ENDPOINT_NEWS_REVIEW || "review-news";
const API_ENDPOINT_NEWS_AI_RETRY =
  process.env.API_ENDPOINT_NEWS_AI_RETRY || "admin-ai-retry";
interface NewsListQueryParams {
  category?: string;
  keyword?: string;
  reviewed?: boolean;
  limit?: number;
  offset?: number;
}

const buildQueryString = (
  params: Record<string, string | number | boolean | undefined>,
): string => {
  const queryParams = new URLSearchParams();

  // Map our parameter names to json-server's expected names
  const paramMap: Record<string, string> = {
    offset: "_start",
    limit: "_limit",
    keyword: "q",
    // Add other parameter mappings as needed
  };

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      // Use mapped parameter name if it exists, otherwise use the original
      const paramName = paramMap[key] || key;
      queryParams.append(paramName, String(value));
    }
  });

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : "";
};

export const API_ENDPOINTS = {
  NEWS: {
    LIST: (params: NewsListQueryParams = {}) => {
      const defaultParams = {
        // _limit: 10, // json-server uses _limit instead of limit
        // _start: 0, // json-server uses _start instead of offset
        ...params,
      };
      // Remove the /api prefix to match json-server's endpoint
      return `${API_BASE_URL}/${API_ENDPOINT_NEWS_LIST}${buildQueryString(defaultParams)}`;
    },
    DETAIL: (id: string) => `${API_BASE_URL}/${API_ENDPOINT_NEWS_DETAIL}/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/${API_ENDPOINT_NEWS_UPDATE}/${id}`,
    REVIEW: (id: string) => `${API_BASE_URL}/${API_ENDPOINT_NEWS_REVIEW}/${id}`,
    AI_RETRY: (id: string) =>
      `${API_BASE_URL}/${API_ENDPOINT_NEWS_AI_RETRY}/${id}`,
  },
} as const;

// For development with mock data
export const MOCK_ENDPOINTS = {
  NEWS: {
    LIST: "/api/mockNews.json",
    DETAIL: "/api/mockNewsDetail.json",
  },
} as const;
