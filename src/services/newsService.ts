import { API_ENDPOINTS, getHeaders } from "../config/api";
import { INewsItem, TRANSLATION_LANGUAGES } from "../types/NewsItem";
import { UserInfo } from "../types/user";

export enum NewsReviewAction {
  APPROVE = "APPROVED",
  REJECT = "REJECTED",
  PENDING = "PENDING",
}

interface FetchNewsDetailOptions {
  signal?: AbortSignal;
  maxRetries?: number;
  languageCode?: TRANSLATION_LANGUAGES;
}

/**
 * Fetches the current user's information
 * @returns Promise that resolves with the user's information
 */
export const fetchUserInfo = async (
  signal?: AbortSignal,
): Promise<UserInfo> => {
  const response = await fetch(API_ENDPOINTS.USER.INFO(), {
    method: "GET",
    headers: getHeaders(),
    signal,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }

  return response.json();
};

export const newsService = {
  /**
   * Retry AI processing for a news item
   * @param id News item ID
   * @returns Promise that resolves when the request is complete
   */
  retryAIProcessing: async (id: string): Promise<void> => {
    const response = await fetch(API_ENDPOINTS.NEWS.AI_RETRY(id), {
      method: "GET",
      headers: {
        ...getHeaders(),
        "client-key": "admin",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to refresh AI status");
    }
  },

  /**
   * Fetches news details by ID with retry mechanism
   * @param id News item ID
   * @param options Configuration options including signal for aborting and maxRetries
   * @returns Promise that resolves with the news item data
   */
  /**
   * Reviews a news item (approve/reject)
   * @param id News item ID
   * @param action Review action (APPROVE/REJECT)
   * @param comment Optional comment for the review
   * @returns Promise that resolves when the review is complete
   */
  reviewNewsItem: async (
    id: string,
    action: NewsReviewAction,
    comment?: string,
  ): Promise<void> => {
    const url = new URL(API_ENDPOINTS.NEWS.REVIEW(id));
    url.searchParams.append("reviewerId", "2"); // TODO: Replace with actual reviewer ID from auth
    url.searchParams.append("status", action);

    // Add comment if it's a rejection and comment exists
    if (action === NewsReviewAction.REJECT && comment?.trim()) {
      url.searchParams.append("comment", comment.trim());
    }

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        ...getHeaders(),
        "client-key": "admin",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to ${action.toLowerCase()} news item`);
    }
  },

  /**
   * Updates a news item with the provided data
   * @param id News item ID
   * @param data Partial news item data to update
   * @returns Promise that resolves with the updated news item
   */
  updateNewsItem: async (
    id: string,
    data: Partial<INewsItem>,
  ): Promise<INewsItem> => {
    const response = await fetch(API_ENDPOINTS.NEWS.UPDATE(id), {
      method: "POST",
      headers: {
        ...getHeaders(),
        "client-key": "admin",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to update news item: ${response.statusText}`,
      );
    }

    return response.json();
  },

  /**
   * Fetches news details by ID with retry mechanism
   * @param id News item ID
   * @param options Configuration options including signal for aborting, maxRetries, and languageCode
   * @returns Promise that resolves with the news item data
   */
  fetchNewsDetail: async (
    id: string,
    options: FetchNewsDetailOptions = {},
  ): Promise<INewsItem> => {
    const { signal, maxRetries = 2, languageCode } = options;
    let retryCount = 0;

    const fetchWithRetry = async (): Promise<INewsItem> => {
      try {
        const url = new URL(API_ENDPOINTS.NEWS.DETAIL(id));

        // Add language code to query params if provided
        if (languageCode) {
          url.searchParams.append("languageCode", languageCode);
        }

        const response = await fetch(url.toString(), {
          signal,
          headers: {
            ...getHeaders(),
            "client-key": "admin",
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("News item not found");
          }

          if (response.status === 500 && retryCount < maxRetries) {
            retryCount++;
            console.log(
              `Retrying API call (attempt ${retryCount}/${maxRetries})`,
            );
            return new Promise((resolve) =>
              setTimeout(() => resolve(fetchWithRetry()), 1000 * retryCount),
            );
          }

          throw new Error(
            `Failed to fetch news detail: ${response.statusText}`,
          );
        }

        return await response.json();
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          throw error; // Re-throw abort errors immediately
        }

        if (retryCount < maxRetries) {
          retryCount++;
          console.log(
            `Retrying after error (attempt ${retryCount}/${maxRetries})`,
          );
          return new Promise((resolve) =>
            setTimeout(() => resolve(fetchWithRetry()), 1000 * retryCount),
          );
        }

        throw error; // Re-throw the error if max retries reached
      }
    };

    return fetchWithRetry();
  },
};

export default newsService;
