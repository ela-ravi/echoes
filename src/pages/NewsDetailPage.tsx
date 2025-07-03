import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUserCircle, FaComment } from "react-icons/fa";

// Components
import TagCell from "../components/molecules/TagCell";
import HeaderNav from "../components/organisms/HeaderNav";
import TranslationSection from "../components/organisms/TranslationSection";
import Section from "../components/atoms/Section";
import TextArea from "../components/atoms/TextArea";
import ContentModal from "../components/molecules/ContentModal";
import RejectModal from "../components/molecules/RejectModal";
import CTASection from "../components/molecules/CTASection";
import BadgesSection from "../components/molecules/BadgesSection";
import UserInfoItem from "../components/molecules/UserInfoItem";
import MediaRow from "../components/molecules/MediaRow";

// Hooks
import { INewsItem } from "../types/NewsItem";
import { useAIRefresh } from "../hooks/useAIRefresh";
import { NewsReviewAction, newsService } from "../services/newsService";
import { TRANSLATION_LANGUAGES } from "../types/NewsItem";
import { API_ENDPOINTS, getHeaders } from "../config/api";

// Language options for the translation dropdown
const LANGUAGES = [
  { value: "hin_Deva", label: "Hindi" },
  { value: "tam_Taml", label: "Tamil" },
  { value: "tel_Telu", label: "Telugu" },
  { value: "kan_Knda", label: "Kannada" },
  { value: "mal_Mlym", label: "Malayalam" },
  { value: "eng_Latn", label: "English" },
];

interface StatusBadgeProps {
  status?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusLower = status?.toLowerCase() || "pending";
  const statusText = status || "Pending";

  const getStatusClasses = () => {
    switch (statusLower) {
      case "published":
        return "bg-[var(--color-status-bg-published)] text-[var(--color-status-text-published)]";
      case "rejected":
        return "bg-[var(--color-status-bg-rejected)] text-[var(--color-status-text-rejected)]";
      case "reviewed":
        return "bg-[var(--color-status-bg-reviewed)] text-[var(--color-status-text-reviewed)]";
      case "submitted":
        return "bg-[var(--color-status-bg-submitted)] text-[var(--color-status-text-submitted)]";
      default:
        return "bg-[var(--color-status-bg-pending)] text-[var(--color-status-text-pending)]";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusClasses()}`}
    >
      {statusText}
    </span>
  );
};

type FormDataState = {
  originalText: string;
  aiGeneratedText: string;
  keyIndividuals: string;
  potentialImpact: string;
};

type SelectedImage = {
  title: string;
  src: string;
} | null;

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
  const [selectedImage, setSelectedImage] = useState<SelectedImage>(null);

  const userType = sessionStorage.getItem("userType");
  const isClient = userType === "CLIENT";

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

  const similarSourceContent = newsItem?.similarSourceUrl ? (
    <a
      href={newsItem.similarSourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400 hover:underline text-sm"
    >
      {newsItem.similarSourceName || "View Source"}
    </a>
  ) : (
    <span className="text-gray-400 text-sm">
      {newsItem?.similarSourceName || "N/A"}
    </span>
  );

  const statusContent = (
    <div className="flex items-center gap-2">
      <StatusBadge status={newsItem?.clientStatus} />
      {newsItem?.clientStatus?.toLowerCase() === "rejected" &&
        newsItem?.comments && (
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
  );

  // Custom hooks must be called unconditionally
  const { isRefreshing, handleAIRefresh } = useAIRefresh();

  const handleRefreshClick = async () => {
    if (!newsItem?.id) return;

    try {
      await handleAIRefresh(newsItem.id.toString(), async () => {
        // Refetch the news item to get updated status after successful refresh
        const updatedData = await newsService.fetchNewsDetail(
          newsItem.id.toString(),
        );
        setNewsItem(updatedData);
      });
    } catch (err) {
      console.error("Error refreshing AI status:", err);
      // Error is already handled by useAIRefresh hook
    }
  };

  const fetchNewsDetail = async (languageCode?: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get("id");

    if (!newsId) {
      setError("No news ID provided");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const data = await newsService.fetchNewsDetail(newsId, {
        signal: controller.signal,
        languageCode: languageCode as TRANSLATION_LANGUAGES,
      });
      console.log("==>> API data:", data);
      setNewsItem((prev) => ({
        ...prev,
        ...data,
        // Only update these fields if they exist in the response
        ...(data.originalText && { originalText: data.originalText }),
        ...(data.aiGeneratedText && { aiGeneratedText: data.aiGeneratedText }),
        ...(data.keyIndividuals && { keyIndividuals: data.keyIndividuals }),
        ...(data.potentialImpact && { potentialImpact: data.potentialImpact }),
      }));
      setInitialFormData((prev) => ({
        ...(prev || {}),
        originalText: data.originalText || prev?.originalText || "",
        aiGeneratedText: data.aiGeneratedText || prev?.aiGeneratedText || "",
        keyIndividuals: data.keyIndividuals || prev?.keyIndividuals || "",
        potentialImpact: data.potentialImpact || prev?.potentialImpact || "",
      }));
      // Update form data with the new values, ensuring all fields are strings
      setFormData((prev) => ({
        ...(prev || {}),
        originalText: data.originalText || prev?.originalText || "",
        aiGeneratedText: data.aiGeneratedText || prev?.aiGeneratedText || "",
        keyIndividuals: data.keyIndividuals || prev?.keyIndividuals || "",
        potentialImpact: data.potentialImpact || prev?.potentialImpact || "",
      }));

      // Show success message if this was a language change
      if (languageCode) {
        const languageName =
          LANGUAGES.find(
            (lang: { value: string; label: string }) =>
              lang.value === languageCode,
          )?.label || languageCode;
        toast.success(`Switched to ${languageName} translation`);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(`Failed to load translation: ${err.message}`);
      } else {
        setError("An unknown error occurred");
        toast.error("Failed to load translation");
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  // Save form data
  const handleSave = async () => {
    if (!newsItem || !hasChanges || !formData) return;

    try {
      const updatedNewsItem = await newsService.updateNewsItem(
        newsItem.id.toString(),
        {
          ...formData,
          id: newsItem.id,
        },
      );

      setNewsItem(updatedNewsItem);
      setInitialFormData(formData);
      setHasChanges(false);
      toast.success("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save changes. Please try again.",
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
      await newsService.reviewNewsItem(
        newsItem.id.toString(),
        NewsReviewAction.REJECT,
        rejectComment,
      );

      toast.success("Successfully rejected news item");
      setShowRejectModal(false);
      setRejectComment("");

      // Refresh the page or navigate away
      window.location.reload();
    } catch (error) {
      console.error("Error rejecting news item:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to reject news item",
      );
    }
  };

  // Data fetching effect with cleanup and mounted ref
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    let isFetching = false;

    const fetchNewsData = async () => {
      // Prevent multiple simultaneous fetches
      if (isFetching) return;
      isFetching = true;

      // Get the news ID from the URL
      const urlParams = new URLSearchParams(window.location.search);
      const newsId = urlParams.get("id");

      if (!newsId) {
        setError("No news ID provided in the URL");
        setLoading(false);
        isFetching = false;
        return;
      }

      try {
        setLoading(true);
        setError(null);

        await fetchNewsDetail();

        if (!isMounted) return;
        console.log("==>> newsItem:", newsItem);
        // Update form data when newsItem changes
        if (newsItem) {
          const newFormData = {
            originalText: newsItem?.originalText || "",
            aiGeneratedText: newsItem?.aiGeneratedText || "",
            keyIndividuals: newsItem?.keyIndividuals || "",
            potentialImpact: newsItem?.potentialImpact || "",
          };

          // Only update form data if we don't have any data yet
          // or if the newsItem ID has changed
          if (!formData || formData.originalText !== newFormData.originalText) {
            setFormData(newFormData);
            setInitialFormData(newFormData);
          }
        }
      } catch (err) {
        if (isMounted) {
          if (err instanceof Error && err.name === "AbortError") {
            console.log("Fetch aborted");
          } else {
            setError(
              err instanceof Error
                ? err.message
                : "Failed to load news details",
            );
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          isFetching = false;
        }
      }
    };

    // Use a small timeout to allow potential previous renders to complete
    // This helps prevent the double-fetch in development mode
    const timer = setTimeout(() => {
      fetchNewsData();
    }, 0);

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
      if (!prev) return prev; // Don't update if formData is not initialized

      const newData = {
        ...prev,
        [name]: value,
      };

      // Check if any field has changed from its initial value
      // if (initialFormData) {
      //   const hasChanges = Object.entries(newData).some(
      //     ([key, val]) => initialFormData[key as keyof FormDataState] !== val
      //   );
      //   setHasChanges(hasChanges);
      // }
      console.log("==>> prev, new:", prev, newData);
      const hasChanges = Object.entries(newData).some(
        ([key, val]) => prev[key as keyof FormDataState] !== val,
      );
      setHasChanges(hasChanges);

      return newData;
    });
  };

  // Update hasChanges when initial data is loaded
  useEffect(() => {
    console.log("==> Data:", formData, initialFormData);
    if (formData && initialFormData) {
      const changes = Object.entries(formData).some(
        ([key, val]) => initialFormData[key as keyof FormDataState] !== val,
      );
      setHasChanges(changes);
    } else {
      setHasChanges(false);
    }
  }, [formData, initialFormData]);

  // Loading and error states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!newsItem) return <div>No data found</div>;

  if (!newsItem) {
    return (
      <div className="relative flex min-h-screen flex-col bg-[var(--color-bg-header)] text-[var(--color-text-primary)]">
        <HeaderNav hideSearch />
        <main className="flex flex-1 flex-col items-center justify-center p-6">
          <h1 className="text-2xl font-bold">News Item Not Found</h1>
          <Link
            to="/news"
            className="mt-4 text-[var(--color-ui-primary)] hover:underline"
          >
            Back to News List
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[var(--color-bg-header)] text-[var(--color-text-primary)]">
      <HeaderNav hideSearch />
      <main className="flex flex-1 justify-center px-3 md:px-10 pt-24 pb-5">
        <div className="w-full max-w-[95%] md:max-w-[90%]">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-[32px] font-bold leading-tight tracking-tight text-[var(--color-text-primary)]">
              News Item ID: {newsItem.id}
            </h1>
          </div>
          <Section title="User Details">
            <div className="bg-[var(--color-bg-card)] p-6 my-3 rounded-xl">
              <div className="flex flex-col space-y-4">
                {/* Top Row: User Info */}
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <FaUserCircle size={48} color="var(--color-ui-primary)" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
                      {newsItem.user || "Unknown User"}
                    </h3>
                    <p className="text-gray-400">
                      {newsItem.userMailId || "No email provided"}
                    </p>
                  </div>
                  {isClient && (
                    <div className="ml-auto">
                      <TranslationSection
                        onLanguageChange={async (languageCode) => {
                          try {
                            setLoading(true);
                            await fetchNewsDetail(languageCode);
                          } catch (error) {
                            console.error("Error changing language:", error);
                          } finally {
                            setLoading(false);
                          }
                        }}
                        onRequestTranslation={async (languageCode) => {
                          try {
                            setLoading(true);
                            const urlParams = new URLSearchParams(
                              window.location.search,
                            );
                            const newsId = urlParams.get("id");

                            if (!newsId) {
                              throw new Error("News ID not found");
                            }

                            const response = await fetch(
                              `${API_ENDPOINTS.CLIENT.TRANSLATE(newsId)}?languageCode=${languageCode}`,
                              {
                                method: "GET",
                                headers: {
                                  ...getHeaders(),
                                  accept: "*/*",
                                },
                              },
                            );

                            if (!response.ok) {
                              const errorData = await response
                                .json()
                                .catch(() => ({}));
                              throw new Error(
                                errorData.message ||
                                  "Failed to request translation",
                              );
                            }

                            toast.success(
                              `Successfully requested translation to ${languageCode}`,
                            );
                          } catch (error) {
                            console.error(
                              "Error requesting translation:",
                              error,
                            );
                            toast.error(
                              error instanceof Error
                                ? error.message
                                : "Failed to request translation",
                            );
                          } finally {
                            setLoading(false);
                          }
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Bottom Row: Additional Info */}
                <div className="space-y-4 pt-3 border-t border-[var(--color-bg-hover)]">
                  {/* First Row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Similar Source */}
                    {
                      // (newsItem.similarSourceName ||
                      //   newsItem.similarSourceUrl) &&
                      <UserInfoItem
                        label="SIMILAR SOURCE"
                        content={similarSourceContent}
                      />
                    }

                    {/* Status */}
                    <UserInfoItem label="STATUS" content={statusContent} />

                    {/* AI Status */}
                    <UserInfoItem
                      label="AI STATUS"
                      status={newsItem.aiStatus || "IN_PROGRESS"}
                      onRefresh={handleRefreshClick}
                      isRefreshing={isRefreshing}
                    />

                    {/* Categories */}
                    {newsItem.categories && newsItem.categories.length > 0 && (
                      <UserInfoItem
                        label="CATEGORIES"
                        categories={newsItem.categories}
                      />
                    )}
                  </div>

                  {/* Second Row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-[var(--color-bg-hover)]">
                    {/* Submitted At */}
                    <UserInfoItem
                      userName={newsItem.user}
                      label="SUBMITTED AT"
                      timestamp={newsItem.submittedAt}
                      fallbackText="N/A"
                    />

                    {/* Reviewed By */}
                    <UserInfoItem
                      label="REVIEWED BY"
                      userName={newsItem.reviewedBy}
                      timestamp={newsItem.reviewedAt}
                      fallbackText="Not reviewed"
                    />

                    {/* Published By */}
                    <div className="col-span-1">
                      <div className="text-xs text-gray-500 mb-1">
                        PUBLISHED BY
                      </div>
                      {newsItem.publishedBy &&
                      newsItem.publishedBy.length > 0 ? (
                        <div>
                          <TagCell
                            tags={newsItem.publishedBy}
                            className="text-sm"
                            type="publishedBy"
                          />
                          {newsItem.publishedAt && (
                            <div className="text-xs text-gray-400 mt-1">
                              {new Date(newsItem.publishedAt).toLocaleString()}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400">
                          Not published
                        </div>
                      )}
                    </div>

                    {/* Rejected By */}
                    <div className="col-span-1">
                      <div className="text-xs text-gray-500 mb-1">
                        REJECTED BY
                      </div>
                      {newsItem.rejectedBy && newsItem.rejectedBy.length > 0 ? (
                        <div>
                          <TagCell
                            tags={newsItem.rejectedBy}
                            className="text-sm"
                            type="rejectedBy"
                          />
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400">
                          Not rejected
                        </div>
                      )}
                    </div>

                    {/* Reward Points - Always show, default to 0 if not available */}
                    <UserInfoItem
                      label="REWARD POINTS"
                      rewardPoints={
                        typeof newsItem.rewardPoints === "number"
                          ? newsItem.rewardPoints
                          : 0
                      }
                    />

                    {/* Badges - Show with default values if not available */}
                    <BadgesSection
                      badges={{
                        GOLD: newsItem.badges?.GOLD || 0,
                        SILVER: newsItem.badges?.SILVER || 0,
                        BRONZE: newsItem.badges?.BRONZE || 0,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section title="Original Raw Submission">
            <TextArea
              name="originalText"
              value={formData.originalText}
              // className="border-none"
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
                  <MediaRow
                    title="User Uploaded Content"
                    imageUrl={newsItem.userUploadedImage}
                    videoUrl={newsItem.userUploadedVideo}
                    isAI={false}
                    onImageClick={(title, src) => {
                      setSelectedImage({ title, src });
                      setShowImageOverlay(true);
                    }}
                  />
                )}

                {/* AI Generated Media Row */}
                {(newsItem.aiGeneratedImage || newsItem.aiGeneratedVideo) && (
                  <MediaRow
                    title="AI Generated Content"
                    imageUrl={newsItem.aiGeneratedImage}
                    videoUrl={newsItem.aiGeneratedVideo}
                    isAI={true}
                    onImageClick={(title, src) => {
                      setSelectedImage({ title, src });
                      setShowImageOverlay(true);
                    }}
                  />
                )}
              </div>
            </Section>
          )}

          {showImageOverlay && selectedImage && (
            <ContentModal
              title={selectedImage.title}
              onClose={() => {
                setShowImageOverlay(false);
                setSelectedImage(null);
              }}
              showCloseButton={true}
              content={
                <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-4">
                  <img
                    src={selectedImage.src}
                    alt="Full Size Preview"
                    className="max-w-full max-h-[70vh] object-contain"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              }
            />
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
