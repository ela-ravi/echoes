import { INewsItem } from "../types/NewsItem";

// Dummy data – replace with real API data later
export const mockNews: INewsItem[] = [
  {
    id: "NWS-0001234",
    title: "Economic Outlook Brightens as Markets Rally",
    sourceName: "Reuters",
    socialMediaUrl: "https://reuters.com/markets/story-123",
    categories: ["Economy", "Markets"],
    publishedAt: "2025-06-17 10:05",
    aiStatus: "Processed",
    clientStatus: "Accepted",
  },
  {
    id: "NWS-0001235",
    title: "Tech Giants Announce New AI Partnership for Climate Action",
    sourceName: "Bloomberg",
    socialMediaUrl: "https://bloomberg.com/tech/story-987",
    categories: ["Technology", "Environment"],
    publishedAt: "2025-06-17 09:15",
    aiStatus: "Queued",
    clientStatus: "Pending",
  },
];
