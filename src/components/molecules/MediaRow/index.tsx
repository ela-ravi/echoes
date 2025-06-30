import React from "react";
import MediaSection from "../MediaSection";

interface MediaRowProps {
  title: string;
  imageUrl?: string;
  videoUrl?: string;
  isAI: boolean;
  onImageClick?: (title: string, src: string) => void;
}

const MediaRow: React.FC<MediaRowProps> = ({
  title,
  imageUrl,
  videoUrl,
  isAI,
  onImageClick,
}) => (
  <div className="space-y-2">
    <h3 className="text-lg font-semibold text-white border-b border-[#394060] pb-2">
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {imageUrl && (
        <div className="w-full">
          <MediaSection
            title={title}
            url={imageUrl}
            type="image"
            isAI={isAI}
            onClick={() =>
              onImageClick?.(`${isAI ? "AI " : ""}Generated Image`, imageUrl)
            }
          />
        </div>
      )}
      {videoUrl && (
        <div className="w-full">
          <MediaSection title={title} url={videoUrl} type="video" isAI={isAI} />
        </div>
      )}
    </div>
  </div>
);

export default MediaRow;
