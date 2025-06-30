export enum NEWSACTION {
  REVIEWED = "REVIEWED",
  PUBLISHED = "PUBLISHED",
  REJECTED = "REJECTED",
}
/**
 * Determines if an action is allowed based on the current status
 * @param status Current status of the news item
 * @param actionType Type of action being attempted
 * @returns boolean indicating if the action is allowed
 */
export const isActionAllowed = (
  status: string,
  actionType: string,
): boolean => {
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

/**
 * Gets the tooltip text for an action based on the current status
 * @param status Current status of the news item
 * @param actionType Type of action being attempted
 * @returns Tooltip text string
 */
export const getActionTooltip = (
  status: string,
  actionType: string,
): string => {
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

import { toast } from "react-toastify";
import newsService, { NewsReviewAction } from "../services/newsService";

/**
 * Handles news item actions (review, publish, reject)
 * @param id News item ID
 * @param action Action to perform (REVIEWED, PUBLISHED, REJECTED)
 * @param newsService News service instance
 * @param comment Optional comment for the action
 * @returns Promise that resolves when the action is complete
 */
export const handleAction = async (
  id: string,
  action: NEWSACTION,
  comment?: string,
) => {
  try {
    const reviewAction =
      action === "REVIEWED"
        ? NewsReviewAction.APPROVE
        : action === "REJECTED"
          ? NewsReviewAction.REJECT
          : NewsReviewAction.PENDING;

    await newsService.reviewNewsItem(id, reviewAction, comment);
    toast.success(`News item ${action.toLowerCase()} successfully`);
  } catch (error) {
    console.error(`Error ${action.toLowerCase()}ing news item:`, error);
    toast.error(
      `Failed to ${action.toLowerCase()} news item: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
};
// export const handleAction = async <
//   T extends {
//     reviewNewsItem: (
//       id: string,
//       action: NewsReviewAction,
//       comment?: string,
//     ) => Promise<void>;
//   },
// >(
//   id: string,
//   action: "REVIEWED" | "PUBLISHED" | "REJECTED",
//   newsService: T,
//   comment?: string,
// ): Promise<void> => {
//   // Map action to NewsReviewAction
//   const reviewAction =
//     action === "REVIEWED"
//       ? NewsReviewAction.APPROVE
//       : action === "REJECTED"
//         ? NewsReviewAction.REJECT
//         : NewsReviewAction.PENDING;

//   await newsService.reviewNewsItem(id, reviewAction, comment);
// };
