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

  const borderColor = isClient ? "#603939" : "#394060";
  if (!url) {
    return null;
  }

  const handleVideoReady = () => {
    setIsVideoReady(true);
  };

  return (
    <div
      className={`border border-[${borderColor}] rounded-lg overflow-hidden mb-6 transition-all duration-300 hover:border-[${isClient ? "#f74f4f" : "#4f8ef7"}]`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex items-center gap-2 p-3 bg-[${isClient ? "#3e181a" : "#1d2030"}] border-b border-[${borderColor}]`}
      >
        {isAI ? (
          <SiOpenai className="text-[#4f8ef7]" />
        ) : type === "image" ? (
          <FaImage className="text-[#99a2c2]" />
        ) : (
          <FaVideo className="text-[#99a2c2]" />
        )}
        <span className="text-sm font-medium text-white">{title}</span>
      </div>
      <div
        className={`relative aspect-video bg-[${isClient ? "#201313" : "#131520"}] overflow-hidden`}
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

export default MediaSection;
