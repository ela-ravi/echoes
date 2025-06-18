export interface INewsItem {
  /** Unique identifier for the news item */
  id: string;
  /** Title of the news item */
  title: string;
  /** Original text content of the news */
  originalText?: string;
  /** AI-generated content */
  aiGeneratedText?: string;
  /** AI generated image URL */
  aiGeneratedImage?: string;
  /** AI generated video URL */
  aiGeneratedVideo?: string;
  /** User posted image URL */
  userUploadedImage?: string;
  /** User posted video URL */
  userUploadedVideo?: string;
  /** Name of a similar source */
  similarSourceName?: string;
  /** URL of a similar source */
  similarSourceUrl?: string;
  /** Name of the user who submitted the news */
  user?: string;
  /** Email of the user who submitted the news */
  userMailId?: string;
  /** Name of the reviewer, if reviewed */
  reviewedBy?: string | null;
  /** Current status of the item for the client */
  clientStatus?: "Pending" | "Fake" | "Trusted";
  /** List of category names the news item belongs to */
  categories?: string[];
  /** Publication date in ISO format */
  publishedAt?: string;
  reviewedAt?: string;
  /** Status of AI processing */
  aiStatus?: "InProgress" | "Completed" | "Failed";
  /** Summary of the news */
  summary?: string;
  /** Key individuals mentioned in the content */
  keyIndividuals?: string;
  /** Any conflicting information found in the content */
  conflictingDetails?: string;
  /** Potential impact of the news */
  potentialImpact?: string;
  /** Suggested data points for further analysis */
  suggestedDataPoints?: string;
}
