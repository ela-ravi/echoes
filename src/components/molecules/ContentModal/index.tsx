import React, { ReactNode } from "react";

export interface ContentModalProps {
  title: string;
  content: string | ReactNode;
  onClose: () => void;
  showCloseButton?: boolean;
}

const ContentModal: React.FC<ContentModalProps> = ({
  title,
  content,
  onClose,
  showCloseButton = true,
}) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1d2030] rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-[#394060]">
          <h3 className="text-xl font-semibold">{title}</h3>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
              aria-label="Close modal"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        <div className="p-6 overflow-y-auto flex-grow">
          <div className="bg-[#1d2030] p-4 rounded-lg">
            {typeof content === "string" ? (
              <div className="whitespace-pre-wrap">{content}</div>
            ) : (
              <div className="w-full h-full">{content}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentModal;
