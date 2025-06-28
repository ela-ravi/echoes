import { API_ENDPOINTS, getHeaders } from "../config/api";

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
};

export default newsService;
