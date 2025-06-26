import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import HeaderNav from "../components/organisms/HeaderNav";
import { API_ENDPOINTS } from "../config/api";
import { INewsItem } from "../types/NewsItem";
import { FaImage, FaVideo, FaPlay, FaUserCircle } from "react-icons/fa";
import { SiOpenai } from "react-icons/si";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type FormDataState = {
  originalText: string;
  aiGeneratedText: string;
  keyIndividuals: string;
  potentialImpact: string;
};

// Helper Components
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="mb-6">
    <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
      {title}
    </h2>
    {children}
  </div>
);

// Media Section Component
const MediaSection: React.FC<{
  title: string;
  type: "image" | "video";
  url?: string;
  isAI?: boolean;
}> = ({ title, type, url, isAI = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  if (!url) {
    return null;
  }

  const handleVideoReady = () => {
    setIsVideoReady(true);
  };

  return (
    <div
      className="border border-[#394060] rounded-lg overflow-hidden mb-6 transition-all duration-300 hover:border-[#4f8ef7]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2 p-3 bg-[#1d2030] border-b border-[#394060]">
        {isAI ? (
          <SiOpenai className="text-[#4f8ef7]" />
        ) : type === "image" ? (
          <FaImage className="text-[#99a2c2]" />
        ) : (
          <FaVideo className="text-[#99a2c2]" />
        )}
        <span className="text-sm font-medium text-white">{title}</span>
      </div>
      <div className="relative aspect-video bg-[#131520] overflow-hidden">
        {type === "image" ? (
          <img src={url} alt={title} className="w-full h-full object-cover" />
        ) : (
          <>
            <video
              src={url}
              className="w-full h-full object-cover"
              controls={isHovered}
              onCanPlay={handleVideoReady}
              onError={(e) => console.error("Video error:", e)}
            />
            {!isVideoReady && !isHovered && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                  <FaPlay className="text-white ml-1" />
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div className="p-2 text-right">
        <span className="text-xs text-[#99a2c2]">
          {isAI ? "AI-Generated" : "User Uploaded"}
        </span>
      </div>
    </div>
  );
};

const TextArea: React.FC<{
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  className?: string;
  sectionTitle: string;
  readOnly?: boolean;
  setOverlayContent: (
    content: { title: string; content: string } | null,
  ) => void;
}> = ({
  name,
  value,
  onChange,
  placeholder,
  className = "",
  sectionTitle,
  readOnly = false,
  setOverlayContent,
}) => (
  <div className="flex flex-col gap-2 py-3">
    <div className="flex flex-1">
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border border-[#394060] bg-[#1d2030] focus:border-[#4f8ef7] min-h-36 placeholder:text-[#99a2c2] p-4 text-base font-normal leading-normal ${className}`}
        readOnly={readOnly}
      />
    </div>
    {value && (
      <div className="flex justify-between items-center">
        <span className="text-sm text-[#99a2c2]">
          {value.length} characters
        </span>
        <button
          type="button"
          className="text-sm text-[#4f8ef7] hover:underline flex items-center gap-1"
          onClick={() =>
            setOverlayContent({
              title: sectionTitle,
              content: value,
            })
          }
        >
          View full content
        </button>
      </div>
    )}
  </div>
);

const NewsDetailPage: React.FC = () => {
  // State hooks at the top level
  const [newsItem, setNewsItem] = useState<INewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overlayContent, setOverlayContent] = useState<{
    title: string;
    content: string;
  } | null>(null);
  const [showImageOverlay, setShowImageOverlay] = useState(false);
  const [formData, setFormData] = useState<FormDataState>({
    originalText: "",
    aiGeneratedText: "",
    keyIndividuals: "",
    potentialImpact: "",
  });

  // Store initial form data for reset functionality
  const [initialFormData, setInitialFormData] = useState<FormDataState>({
    originalText: "",
    aiGeneratedText: "",
    keyIndividuals: "",
    potentialImpact: "",
  });

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

  // Discard changes
  const handleDiscard = async () => {
    const confirmResult = await new Promise((resolve) => {
      toast.info(
        <div>
          <p className="mb-2">Are you sure you want to discard all changes?</p>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => {
                toast.dismiss();
                resolve(true);
              }}
            >
              Discard
            </button>
            <button
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={() => {
                toast.dismiss();
                resolve(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>,
        {
          closeButton: false,
          closeOnClick: false,
          draggable: false,
          autoClose: false,
        },
      );
    });

    if (confirmResult) {
      setFormData(initialFormData);
      toast.success("Changes discarded successfully!");
    }
  };

  // Data fetching effect with cleanup and mounted ref
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    let retryCount = 0;
    const MAX_RETRIES = 2;

    const fetchNewsDetail = async () => {
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

        if (!isMounted) return;

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
            return;
          }
          throw new Error(
            `Failed to fetch news detail: ${response.statusText}`,
          );
        }

        const data: INewsItem = await response.json();

        if (!isMounted) return;

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
        }
      }
    };

    fetchNewsDetail();

    // Cleanup function
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // Loading and error states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!newsItem) return <div>No data found</div>;

  const TextOverlay: React.FC<{
    title: string;
    content: string;
    onClose: () => void;
  }> = ({ title, content, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-4xl rounded-xl bg-[#1d2030] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto rounded-lg bg-[#131520] p-4 text-white whitespace-pre-wrap">
          {content || (
            <span className="text-gray-500">No content available</span>
          )}
        </div>
      </div>
    </div>
  );

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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormDataState) => ({
      ...prev,
      [name as keyof FormDataState]: value,
    }));
  };

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
              <svg
                className="w-3 h-3"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Categories Overlay */}
        {showOverlay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-[#1d2030] rounded-lg p-4 max-w-sm w-full mx-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Categories</h3>
                <button
                  type="button"
                  onClick={() => setShowOverlay(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center rounded-full bg-[#282d43] px-4 py-1 text-xs font-medium text-white"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

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
                    {(newsItem.similarSourceName || newsItem.similarSourceUrl) && (
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
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          newsItem.clientStatus?.toLowerCase() === "published"
                            ? "bg-green-900/30 text-green-400"
                            : newsItem.clientStatus?.toLowerCase() === "rejected"
                              ? "bg-red-900/30 text-red-400"
                              : newsItem.clientStatus?.toLowerCase() === "reviewed"
                                ? "bg-[#1d2030] text-[#4f8ef7]"
                                : newsItem.clientStatus?.toLowerCase() === "submitted"
                                  ? "bg-[#282d43] text-white"
                                  : "bg-yellow-900/30 text-yellow-400"
                        }`}
                      >
                        {newsItem.clientStatus || "Pending"}
                      </span>
                    </div>

                    {/* AI Status */}
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        AI STATUS
                      </p>
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
                          : "N/A"
                        }
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
              onChange={handleChange}
              placeholder="Original Raw Submission"
              sectionTitle="Original Raw Submission"
              readOnly={true}
              setOverlayContent={setOverlayContent}
            />
          </Section>

          <Section title="AI-Curated Summary">
            <TextArea
              name="aiGeneratedText"
              value={formData.aiGeneratedText}
              onChange={handleChange}
              placeholder="AI-generated summary will appear here..."
              sectionTitle="AI-Curated Summary"
              setOverlayContent={setOverlayContent}
            />
          </Section>

          <Section title="Key Individuals Mentioned">
            <TextArea
              name="keyIndividuals"
              value={formData.keyIndividuals}
              onChange={handleChange}
              placeholder="List key individuals mentioned in the article..."
              sectionTitle="Key Individuals Mentioned"
              setOverlayContent={setOverlayContent}
            />
          </Section>

          <Section title="Potential Impact">
            <TextArea
              name="potentialImpact"
              value={formData.potentialImpact}
              onChange={handleChange}
              placeholder="Describe the potential impact of this news..."
              sectionTitle="Potential Impact"
              setOverlayContent={setOverlayContent}
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

          {showImageOverlay && (
            <div
              className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
              onClick={() => setShowImageOverlay(false)}
            >
              <button
                className="absolute top-4 right-4 text-white text-2xl bg-[#394060] rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#4a527f] transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowImageOverlay(false);
                }}
              >
                &times;
              </button>
              <div className="relative max-w-4xl w-full max-h-[90vh]">
                <img
                  src="https://via.placeholder.com/1200x800"
                  alt="AI Generated Thumbnail - Full Size"
                  className="w-full h-full object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 mt-6 p-4 border-t border-[#282d43]">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                to="/news"
                className="flex items-center justify-center gap-2 px-6 py-2 bg-transparent hover:bg-[#282d43] text-[#99a0c2] border border-[#394060] rounded-lg transition-colors lg:hidden"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to News
              </Link>
              <button
                onClick={handleDiscard}
                className="px-6 py-2 bg-transparent hover:bg-[#282d43] text-[#99a0c2] border border-[#f87171] rounded-lg transition-colors"
              >
                Discard Changes
              </button>
            </div>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#4f8ef7] hover:bg-[#3b7af5] text-white rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </main>

      {overlayContent && (
        <TextOverlay
          title={overlayContent.title}
          content={overlayContent.content}
          onClose={() => setOverlayContent(null)}
        />
      )}
    </div>
  );
};

export default NewsDetailPage;
