import { useState } from "react";
import { toast } from "react-toastify";
import { newsService } from "../services/newsService";

interface UseAIRefreshReturn {
  isRefreshing: boolean;
  handleAIRefresh: (
    newsId: string,
    onSuccess?: () => Promise<void>,
  ) => Promise<void>;
}

export const useAIRefresh = (): UseAIRefreshReturn => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleAIRefresh = async (
    newsId: string,
    onSuccess?: () => Promise<void>,
  ): Promise<void> => {
    if (!newsId) return;

    try {
      setIsRefreshing(true);
      await newsService.retryAIProcessing(newsId);

      if (onSuccess) {
        await onSuccess();
      }

      toast.success("AI refresh initiated");
    } catch (err) {
      console.error("Error refreshing AI status:", err);
      toast.error(
        `Failed to refresh AI status: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      );
      throw err; // Re-throw to allow error handling in the component
    } finally {
      setIsRefreshing(false);
    }
  };

  return { isRefreshing, handleAIRefresh };
};

export default useAIRefresh;
