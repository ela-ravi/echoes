export interface INewsItem {
  id: string;
  title: string;
  sourceName: string;
  socialMediaUrl: string;
  /** List of category names the news item belongs to */
  categories: string[];
  publishedAt: string;
  aiStatus: "pending" | "approved" | "rejected";
  /** Current status of the item for the client */
  clientStatus: "Pending" | "Approved" | "Rejected" | "Accepted";
  /** Original text content of the news */
  originalText?: string;
  /** AI-generated content */
  aiGeneratedText?: string;
  /** Summary of the news */
  summary?: string;
  /** Whether the item has been reviewed */
  reviewed: boolean;
  /** Key individuals mentioned */
  keyIndividuals?: string;
  /** Conflicting details */
  conflictingDetails?: string;
  /** Potential impact */
  potentialImpact?: string;
  /** Suggested data points */
  suggestedDataPoints?: string;
  /** User posted image URL */
  userUploadedImage?: string;
  /** User posted video URL */
  userUploadedVideo?: string;
  /** AI generated video URL */
  aiGeneratedVideo?: string;
  /** AI generated image URL */
  aiGeneratedImage?: string;
}
