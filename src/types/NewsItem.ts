export interface INewsItem {
  /** Unique identifier for the news item */
  id: string;
  /** Title of the news item */
  title: string; // AI generated title
  /** Original text content of the news */
  originalText?: string; // Client submitted
  /** AI-generated content */
  aiGeneratedText?: string; // AI generated
  /** AI generated image URL */
  aiGeneratedImage?: string;
  /** AI generated video URL */
  aiGeneratedVideo?: string;
  /** User posted image URL */
  userUploadedImage?: string;
  /** User posted video URL */
  userUploadedVideo?: string;
  /** Name of a similar source */
  similarSourceName?: string; // viible text
  /** URL of a similar source */
  similarSourceUrl?: string; // url embeded on visible text
  /** Name of the user who submitted the news */
  user?: string;
  /** Email of the user who submitted the news */
  userMailId?: string;
  /** Name of the reviewer, if reviewed */
  reviewedBy?: string | null;
  /** Current status of the item for the client */
  clientStatus?: ClientStatus;
  /** List of category names the news item belongs to */
  categories?: string[];
  /** Publication date in ISO format */
  publishedAt?: string;
  reviewedAt?: string;
  submittedAt?: string;
  /** Status of AI processing */
  aiStatus?: "InProgress" | "Completed" | "Failed";
  /** Summary of the news */
  summary?: string;
  /** Key individuals mentioned in the content */
  keyIndividuals?: string;
  /** Potential impact of the news */
  potentialImpact?: string;
  /** Badge level for the news item */
  badges?: { SILVER: number; GOLD: number; BRONZE: number };
  /** Reward points associated with the news item */
  rewardPoints?: number;
}
export type AIStatus = "IN_PROGRESS" | "COMPLETED" | "FAILED";
// export type ClientStatus =
//   | "Submitted"
//   | "Pending"
//   | "Reviewed"
//   | "Published"
//   | "Rejected";

export enum ClientStatus {
  SUBMITTED = "SUBMITTED",
  PENDING = "PENDING",
  REVIEWED = "REVIEWED",
  PUBLISHED = "PUBLISHED",
  REJECTED = "REJECTED",
}
export interface INewsList {
  id: string;
  title: string; // AI generated
  categories: string[];
  similarSourceName?: string; // visible text
  similarSourceUrl?: string; // url embeded on visible text
  publishedAt?: string; // Date at which Published by Client
  user?: string; // Date at which submitted by Client
  aiStatus: AIStatus;
  clientStatus: ClientStatus;
}
