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
  clientStatus: ClientStatus;
  /** List of category names the news item belongs to */
  categories?: string[];
  /** Publication date in ISO format */
  publishedAt?: string;
  reviewedAt?: string;
  submittedAt?: string;
  /** Status of AI processing */
  aiStatus?: AIStatus;
  /** Summary of the news */
  summary?: string;
  /** Key individuals mentioned in the content */
  keyIndividuals?: string;
  /** Potential impact of the news */
  potentialImpact?: string; // When there is some potential risk detected by AI and says not to publish news, keep ClientStatus in ONHOLD
  /** Badge level for the news item */
  badges?: { SILVER: number; GOLD: number; BRONZE: number };
  /** Reward points associated with the news item */
  rewardPoints?: number;
  /** Comments associated with the news item (Available only when ClientStatus is REJECTED) */
  comments?: string;
  /** List of clients who have rejected the news item (when clientStatus is ONHOLD, this should be empty array) */
  rejectedBy?: string[];
  /** List of clients who have published the news item (when clientStatus is ONHOLD, this should be empty array) */
  publishedBy?: string[];
  /** List of clients who have pending the news item (when clientStatus is ONHOLD, this should be empty array) */
  pendingClients?: string[];
  languages: TRANSLATION_LANGUAGES[];
  translatedTitle: string;
  translatedSummary: string;
  translatedIndividual: string;
  translatedRisk: string;
}
export type AIStatus = "IN_PROGRESS" | "COMPLETED" | "FAILED";
export type TRANSLATION_LANGUAGES =
  | "hin_Deva" // Hindi
  | "tam_Taml" // Tamil
  | "tel_Telu" // Telugu
  | "kan_Knda" // Kannada
  | "mal_Mlym" // Malayalam
  | "eng_Latn"; // English

export enum ClientStatus {
  SUBMITTED = "SUBMITTED",
  PENDING = "PENDING",
  REVIEWED = "REVIEWED",
  PUBLISHED = "PUBLISHED",
  REJECTED = "REJECTED",
  ONHOLD = "ONHOLD", // This status should be applied only when AI detects some Potential Risks in publishing news
}
export interface INewsList {
  id: string;
  title: string; // AI generated
  categories: string[];
  similarSourceName?: string; // visible text
  similarSourceUrl?: string; // url embeded on visible text
  publishedAt?: string; // Date at which Published by Client
  submittedBy?: string;
  aiStatus: AIStatus;
  clientStatus: ClientStatus;
  comments?: string;
  publishedCount?: number;
  rejectedCount?: number;
}
