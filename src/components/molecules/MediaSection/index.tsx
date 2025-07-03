import React, { useState } from "react";
import { FaImage, FaVideo, FaPlay } from "react-icons/fa";
import { SiOpenai } from "react-icons/si";

export interface MediaSectionProps {
  title: string;
  type: "image" | "video";
  url?: string;
  isAI?: boolean;
  onClick?: () => void;
}

const MediaSection: React.FC<MediaSectionProps> = ({
  title,
  type,
  url,
  isAI = false,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const userType = sessionStorage.getItem("userType");
  const isClient = userType === "CLIENT";

  if (!url) {
    return null;
  }

  const handleVideoReady = () => {
    setIsVideoReady(true);
  };

  return (
    <div
      className={`border rounded-lg overflow-hidden mb-6 transition-all duration-300 ${isClient ? "border-[var(--color-ui-client-border)] hover:border-[var(--color-ui-client-border-hover)]" : "border-[var(--color-ui-border-light)] hover:border-[var(--color-ui-primary)]"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex items-center gap-2 p-3 ${isClient ? "bg-[var(--color-client-card-dark)]" : "bg-[var(--color-bg-card)]"} border-b ${isClient ? "border-[var(--color-ui-client-border)]" : "border-[var(--color-ui-border-light)]"}`}
      >
        {isAI ? (
          <SiOpenai className="text-[var(--color-ui-primary)]" />
        ) : type === "image" ? (
          <FaImage className="text-[var(--color-ui-primary)]" />
        ) : (
          <FaVideo className="text-[var(--color-ui-primary)]" />
        )}
        <span className="text-sm font-medium text-[var(--color-text-primary)]">
          {title}
        </span>
      </div>
      <div
        className={`relative aspect-video bg-[${isClient ? "#201313" : "var(--color-bg-header)"}] overflow-hidden`}
      >
        {type === "image" ? (
          <img
            src={url}
            alt={title}
            className="w-full h-full object-cover cursor-pointer"
            onClick={onClick}
          />
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
                  <FaPlay className="text-[var(--color-text-primary)] ml-1" />
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div className="p-2 text-right">
        <span className="text-xs text-[var(--color-text-placeholder)]">
          {isAI ? "AI-Generated" : "User Uploaded"}
        </span>
      </div>
    </div>
  );
};

export default MediaSection;
