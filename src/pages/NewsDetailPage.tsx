import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import HeaderNav from "../components/organisms/HeaderNav";
import { API_ENDPOINTS } from "../config/api";
import { INewsItem } from "../types/NewsItem";
import ContentModal from "../components/molecules/ContentModal";
import { FaUserCircle, FaSync, FaComment } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAIRefresh } from "../hooks/useAIRefresh";
import Section from "../components/atoms/Section";
import TextArea from "../components/atoms/TextArea";
import RejectModal from "../components/molecules/RejectModal";
import MediaSection from "../components/molecules/MediaSection";
import { ChevronDown } from "../components/atoms/icons";
import CTASection from "../components/molecules/CTASection";

// Categories Cell Component
const CategoriesCell: React.FC<{ categories: string[] }> = ({
  categories = [],
}) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasManyCategories = useMemo(() => {
    return categories.length > 2;
  }, [categories]);

  const toggleOverlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowOverlay(!showOverlay);
  };

  // Close overlay when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowOverlay(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex flex-wrap gap-2 items-center">
        {categories.slice(0, 2).map((cat) => (
          <span
            key={cat}
            className="inline-flex items-center rounded-full bg-[#282d43] px-4 py-1 text-xs font-medium text-white"
          >
            {cat}
          </span>
        ))}
        {hasManyCategories && (
          <button
            type="button"
            aria-label="Show all categories"
            onClick={toggleOverlay}
            className="inline-flex items-center justify-center rounded-full bg-[#282d43] px-2 py-1 text-xs text-gray-400 hover:bg-[#2d3349] hover:text-white transition-colors"
          >
            <ChevronDown />
          </button>
        )}
      </div>
      {showOverlay && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 bg-[#1d2030] p-4 rounded-lg shadow-lg w-64">
          {categories.slice(2).map((cat) => (
            <span
              key={cat}
              className="block rounded-full bg-[#282d43] px-4 py-1 text-xs font-medium text-white mb-2"
            >
              {cat}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

type FormDataState = {
  originalText: string;
  aiGeneratedText: string;
  keyIndividuals: string;
  potentialImpact: string;
};

const NewsDetailPage: React.FC = () => {
  // All state hooks must be called unconditionally at the top level
  const [newsItem, setNewsItem] = useState<INewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overlayContent, setOverlayContent] = useState<{
    title: string;
    content: string;
  } | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const [showCommentOverlay, setShowCommentOverlay] = useState(false);
  const [showImageOverlay, setShowImageOverlay] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");
  const [formData, setFormData] = useState<FormDataState>({
    originalText: "",
    aiGeneratedText: "",
    keyIndividuals: "",
    potentialImpact: "",
  });
  const [initialFormData, setInitialFormData] = useState<FormDataState>({
    originalText: "",
    aiGeneratedText: "",
    keyIndividuals: "",
    potentialImpact: "",
  });
  const [hasChanges, setHasChanges] = useState(false);

  // Custom hooks must be called unconditionally
  const { isRefreshing, handleAIRefresh } = useAIRefresh();

  const handleRefreshClick = async () => {
    if (!newsItem?.id) return;

    try {
      await handleAIRefresh(newsItem.id.toString(), async () => {
        // Refetch the news item to get updated status after successful refresh
        const response = await fetch(
          API_ENDPOINTS.NEWS.DETAIL(newsItem.id.toString()),
          {
            headers: {
              "Content-Type": "application/json",
              "client-key": "admin",
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch updated news item");
        }

        const updatedData = await response.json();
        setNewsItem(updatedData);
      });
    } catch (err) {
      console.error("Error refreshing AI status:", err);
      // Error is already handled by useAIRefresh hook
    }
  };

  // Save form data
  const handleSave = async () => {
    if (!newsItem) return;

    try {
      const response = await fetch(
        API_ENDPOINTS.NEWS.UPDATE(newsItem.id.toString()),
        {
          method: "POST",
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-expect-error
          headers: {
            "ngrok-skip-browser-warning": true,
            accept: "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            aiGeneratedText: formData.aiGeneratedText,
            keyIndividuals: formData.keyIndividuals,
            potentialImpact: formData.potentialImpact,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save changes");
      }

      // Update initial form data to current values
      setInitialFormData(formData);
      toast.success("Changes saved successfully!");
    } catch (err) {
      console.error("Error saving changes:", err);
      toast.error(
        `Failed to save changes: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      );
    }
  };

  // Reset hasChanges when form data is reset
  const handleDiscard = async () => {
    if (window.confirm("Are you sure you want to discard all changes?")) {
      setFormData(initialFormData);
      setHasChanges(false);
      toast.success("Changes discarded successfully!");
    }
  };

  const handleReject = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!newsItem?.id) return;

    try {
      const url = new URL(API_ENDPOINTS.NEWS.REVIEW(newsItem.id));
      url.searchParams.append("reviewerId", "2"); // Replace with actual reviewer ID
      url.searchParams.append("status", "REJECTED");

      // Add comment if it exists
      if (rejectComment?.trim()) {
        url.searchParams.append("comment", rejectComment.trim());
      }

      const response = await fetch(url.toString(), {
        method: "POST",
        // @ts-expect-error - Skip TypeScript check for custom headers
        headers: {
          "ngrok-skip-browser-warning": true,
          "Content-Type": "application/json",
          "client-key": "admin",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to reject news item");
      }

      toast.success("Successfully rejected news item");
      setShowRejectModal(false);
      setRejectComment("");

      // Refresh the page or navigate away
      window.location.reload();
    } catch (error) {
      console.error("Error rejecting news item:", error);
      toast.error("Failed to reject news item");
    }
  };

  // Data fetching effect with cleanup and mounted ref
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    let retryCount = 0;
    const MAX_RETRIES = 2;
    let isFetching = false;

    const fetchNewsDetail = async () => {
      // Prevent multiple simultaneous fetches
      if (isFetching) return;
      isFetching = true;

      try {
        // Get the news ID from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const newsId = urlParams.get("id");

        if (!newsId) {
          throw new Error("No news ID provided in the URL");
        }

        if (isMounted) {
          setLoading(true);
          setError(null);
        }

        // Skip if this is a retry and we've hit the limit
        if (retryCount >= MAX_RETRIES) {
          isFetching = false;
          return;
        }

        const response = await fetch(API_ENDPOINTS.NEWS.DETAIL(newsId), {
          signal: controller.signal,
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
            "client-key": "admin",
          },
        });

        if (!isMounted) {
          isFetching = false;
          return;
        }

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("News article not found");
          }
          // If we get a 500 error, retry a few times
          if (response.status === 500 && retryCount < MAX_RETRIES) {
            retryCount++;
            console.log(
              `Retrying API call (attempt ${retryCount}/${MAX_RETRIES})`,
            );
            setTimeout(fetchNewsDetail, 1000 * retryCount); // Exponential backoff
            isFetching = false;
            return;
          }
          throw new Error(
            `Failed to fetch news detail: ${response.statusText}`,
          );
        }

        const data: INewsItem = await response.json();

        if (!isMounted) {
          isFetching = false;
          return;
        }

        setNewsItem(data);

        // Initialize form data with the fetched news item
        const newFormData = {
          originalText: data.originalText || "",
          aiGeneratedText: data.aiGeneratedText || "",
          keyIndividuals: data.keyIndividuals || "",
          potentialImpact: data.potentialImpact || "",
        };

        setFormData(newFormData);
        setInitialFormData(newFormData);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          console.log("Fetch aborted");
          return;
        }
        if (isMounted) {
          setError(err instanceof Error ? err.message : "An error occurred");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          isFetching = false;
        }
      }
    };

    // Small delay to allow potential previous fetch to be aborted
    const timer = setTimeout(fetchNewsDetail, 0);

    // Cleanup function
    return () => {
      isMounted = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, []);

  // Handle form input changes and track modifications
  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: value,
      };
      // Check if any field has changed from its initial value
      const hasChanges = Object.entries(newData).some(
        ([key, val]) => initialFormData[key as keyof FormDataState] !== val,
      );
      setHasChanges(hasChanges);
      return newData;
    });
  };

  // Update hasChanges when initial data is loaded
  useEffect(() => {
    const changes = Object.entries(formData).some(
      ([key, val]) => initialFormData[key as keyof FormDataState] !== val,
    );
    setHasChanges(changes);
  }, [formData, initialFormData]);

  // Loading and error states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!newsItem) return <div>No data found</div>;

  if (!newsItem) {
    return (
      <div className="relative flex min-h-screen flex-col bg-[#131520] text-white">
        <HeaderNav hideSearch />
        <main className="flex flex-1 flex-col items-center justify-center p-6">
          <h1 className="text-2xl font-bold">News Item Not Found</h1>
          <Link to="/news" className="mt-4 text-[#4f8ef7] hover:underline">
            Back to News List
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#131520] text-white">
      <HeaderNav hideSearch />
      <main className="flex flex-1 justify-center px-3 md:px-10 pt-24 pb-5">
        <div className="w-full max-w-[95%] md:max-w-[90%]">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-[32px] font-bold leading-tight tracking-tight text-white">
              News Item ID: {newsItem.id}
            </h1>
          </div>
          <Section title="User Details">
            <div className="bg-[#1d2030] p-6 my-3 rounded-xl">
              <div className="flex flex-col space-y-4">
                {/* Top Row: User Info */}
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <FaUserCircle size={48} color="#4f8ef7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white">
                      {newsItem.user || "Unknown User"}
                    </h3>
                    <p className="text-gray-400">
                      {newsItem.userMailId || "No email provided"}
                    </p>
                  </div>
                </div>

                {/* Bottom Row: Additional Info */}
                <div className="space-y-4 pt-3 border-t border-[#2d3349]">
                  {/* First Row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Similar Source */}
                    {(newsItem.similarSourceName ||
                      newsItem.similarSourceUrl) && (
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">
                          SIMILAR SOURCE
                        </p>
                        <p className="text-sm">
                          {newsItem.similarSourceUrl ? (
                            <a
                              href={newsItem.similarSourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline"
                            >
                              {newsItem.similarSourceName || "View Source"}
                            </a>
                          ) : (
                            <span className="text-gray-400">
                              {newsItem.similarSourceName || "N/A"}
                            </span>
                          )}
                        </p>
                      </div>
                    )}

                    {/* Status - Using clientStatus with StatusBadge styling */}
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        STATUS
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            newsItem.clientStatus?.toLowerCase() === "published"
                              ? "bg-green-900/30 text-green-400"
                              : newsItem.clientStatus?.toLowerCase() ===
                                  "rejected"
                                ? "bg-red-900/30 text-red-400"
                                : newsItem.clientStatus?.toLowerCase() ===
                                    "reviewed"
                                  ? "bg-[#1d2030] text-[#4f8ef7]"
                                  : newsItem.clientStatus?.toLowerCase() ===
                                      "submitted"
                                    ? "bg-[#282d43] text-white"
                                    : "bg-yellow-900/30 text-yellow-400"
                          }`}
                        >
                          {newsItem.clientStatus || "Pending"}
                        </span>
                        {newsItem.clientStatus?.toLowerCase() === "rejected" &&
                          newsItem.comments && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowCommentOverlay(true);
                              }}
                              className="text-gray-400 hover:text-blue-400 transition-colors"
                              title="View rejection comment"
                            >
                              <FaComment className="w-3.5 h-3.5" />
                            </button>
                          )}
                      </div>
                    </div>

                    {/* AI Status */}
                    <div>
                      <div className="flex items-center">
                        <p className="text-xs text-gray-500 font-medium">
                          AI STATUS
                        </p>
                        {(newsItem.aiStatus === "FAILED" ||
                          newsItem.aiStatus === "IN_PROGRESS") && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRefreshClick();
                            }}
                            disabled={isRefreshing}
                            className={`text-gray-400 hover:text-blue-400 transition-colors ml-4 ${
                              isRefreshing
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            title="Refresh AI status"
                          >
                            <FaSync
                              className={`w-3 h-3 ${
                                isRefreshing ? "animate-spin" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">
                        {newsItem.aiStatus || "N/A"}
                      </p>
                    </div>

                    {/* Categories */}
                    {newsItem.categories && newsItem.categories.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">
                          CATEGORIES
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <CategoriesCell categories={newsItem.categories} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Second Row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-[#2d3349]">
                    {/* Submitted At */}
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        SUBMITTED AT
                      </p>
                      <p className="text-sm text-gray-400">
                        {newsItem.submittedAt
                          ? new Date(newsItem.submittedAt).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>

                    {/* Reviewed By */}
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        REVIEWED BY
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-400">
                          {newsItem.reviewedBy || "Not reviewed"}
                        </p>
                        {newsItem.reviewedAt && (
                          <p className="text-xs text-gray-500">
                            {new Date(newsItem.reviewedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Reward Points */}
                    {typeof newsItem.rewardPoints === "number" && (
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">
                          REWARD POINTS
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-yellow-400">
                            {newsItem.rewardPoints}
                          </span>
                          <span className="text-xs text-gray-400">points</span>
                        </div>
                      </div>
                    )}

                    {/* Badges */}
                    {newsItem.badges && (
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">
                          BADGES
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(newsItem.badges).map(
                            ([badgeType, count]) =>
                              count > 0 && (
                                <div
                                  key={badgeType}
                                  className="flex items-center space-x-1 bg-[#2d3349] px-2 py-1 rounded-md"
                                >
                                  <img
                                    src={`/assets/${badgeType.toLowerCase()}.png`}
                                    alt={`${badgeType} badge`}
                                    className="w-5 h-5 object-contain"
                                  />
                                  <span className="text-xs text-gray-200 capitalize">
                                    {badgeType.toLowerCase()} ({count})
                                  </span>
                                </div>
                              ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section title="Original Raw Submission">
            <TextArea
              name="originalText"
              value={formData.originalText}
              onChange={handleInputChange}
              placeholder="Original Raw Submission"
              readOnly={true}
              onViewFullContent={() => {
                setOverlayContent({
                  title: "Original Raw Submission",
                  content: formData.originalText,
                });
              }}
            />
          </Section>

          <Section title="AI-Curated Summary">
            <TextArea
              name="aiGeneratedText"
              value={formData.aiGeneratedText}
              onChange={handleInputChange}
              placeholder="AI-generated summary will appear here..."
              onViewFullContent={() => {
                setOverlayContent({
                  title: "AI-Curated Summary",
                  content: formData.aiGeneratedText,
                });
              }}
            />
          </Section>

          <Section title="Key Individuals Mentioned">
            <TextArea
              name="keyIndividuals"
              value={formData.keyIndividuals}
              onChange={handleInputChange}
              placeholder="List key individuals mentioned in the article..."
              onViewFullContent={() => {
                setOverlayContent({
                  title: "Key Individuals Mentioned",
                  content: formData.keyIndividuals,
                });
              }}
            />
          </Section>

          <Section
            title="Potential Risks"
            onRejectClick={(e) => {
              e.stopPropagation();
              setShowRejectModal(true);
            }}
          >
            <TextArea
              name="potentialImpact"
              value={formData.potentialImpact}
              onChange={handleInputChange}
              placeholder="Describe the potential impact of this news..."
              onViewFullContent={() => {
                setOverlayContent({
                  title: "Potential Risks",
                  content: formData.potentialImpact,
                });
              }}
            />
          </Section>

          {/* Media Sections */}
          {(newsItem.aiGeneratedVideo ||
            newsItem.aiGeneratedImage ||
            newsItem.userUploadedImage ||
            newsItem.userUploadedVideo) && (
            <Section title="Media">
              <div className="space-y-8 mt-4">
                {/* User Uploaded Media Row */}
                {(newsItem.userUploadedImage || newsItem.userUploadedVideo) && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white border-b border-[#394060] pb-2">
                      User Uploaded Content
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                      <div className="w-full">
                        {newsItem.userUploadedImage && (
                          <MediaSection
                            title="Uploaded Image"
                            url={newsItem.userUploadedImage}
                            type="image"
                            isAI={false}
                            onClick={() => {
                              if (newsItem.userUploadedImage) {
                                setSelectedImageUrl(newsItem.userUploadedImage);
                                setShowImageOverlay(true);
                              }
                            }}
                          />
                        )}
                      </div>
                      <div className="w-full">
                        {newsItem.userUploadedVideo && (
                          <MediaSection
                            title="Uploaded Video"
                            url={newsItem.userUploadedVideo}
                            type="video"
                            isAI={false}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Generated Media Row */}
                {(newsItem.aiGeneratedImage || newsItem.aiGeneratedVideo) && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white border-b border-[#394060] pb-2">
                      AI Generated Content
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                      <div className="w-full">
                        {newsItem.aiGeneratedImage && (
                          <MediaSection
                            title="AI Generated Image"
                            url={newsItem.aiGeneratedImage}
                            type="image"
                            isAI={true}
                            onClick={() => {
                              if (newsItem.aiGeneratedImage) {
                                setSelectedImageUrl(newsItem.aiGeneratedImage);
                                setShowImageOverlay(true);
                              }
                            }}
                          />
                        )}
                      </div>
                      <div className="w-full">
                        {newsItem.aiGeneratedVideo && (
                          <MediaSection
                            title="AI Generated Video"
                            url={newsItem.aiGeneratedVideo}
                            type="video"
                            isAI={true}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Section>
          )}

          {showImageOverlay && selectedImageUrl && (
            <div
              className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
              onClick={() => {
                setShowImageOverlay(false);
                setSelectedImageUrl("");
              }}
            >
              <button
                className="absolute top-4 right-4 text-white text-2xl bg-[#394060] rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#4a527f] transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowImageOverlay(false);
                  setSelectedImageUrl("");
                }}
              >
                &times;
              </button>
              <div className="relative max-w-4xl w-full max-h-[90vh]">
                <img
                  src={selectedImageUrl}
                  alt="Full Size Preview"
                  className="w-full h-full object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          <CTASection
            onSave={handleSave}
            onDiscard={handleDiscard}
            backLink="/news"
            hasChanges={hasChanges}
          />
        </div>
      </main>

      {showRejectModal && (
        <RejectModal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          onReject={handleReject}
          comment={rejectComment}
          onCommentChange={(e) => setRejectComment(e.target.value)}
        />
      )}
      {showCommentOverlay && newsItem?.comments && (
        <ContentModal
          title="Comments"
          content={newsItem.comments}
          onClose={() => setShowCommentOverlay(false)}
        />
      )}

      {overlayContent && (
        <ContentModal
          title={overlayContent.title}
          content={overlayContent.content}
          onClose={() => setOverlayContent(null)}
        />
      )}
    </div>
  );
};

export default NewsDetailPage;
