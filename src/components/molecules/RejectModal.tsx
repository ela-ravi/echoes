import React from "react";

interface RejectModalProps {
  isOpen: boolean;
  onClose: (e: React.MouseEvent) => void;
  onReject: (e: React.MouseEvent) => void;
  comment: string;
  onCommentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const RejectModal: React.FC<RejectModalProps> = ({
  isOpen,
  onClose,
  onReject,
  comment,
  onCommentChange,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-[var(--color-bg-card)] rounded-lg p-4 max-w-sm w-full mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">Reject News Item</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-[var(--color-text-primary)]"
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
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Reason for rejection <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={comment}
            onChange={onCommentChange}
            className="w-full p-2 bg-[#2a2f45] text-[var(--color-text-primary)] rounded border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Please provide a reason for rejection..."
          />
          {!comment.trim() && (
            <p className="mt-1 text-sm text-red-400">
              Please provide a reason for rejection
            </p>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-[var(--color-text-primary)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onReject}
            disabled={!comment.trim()}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              comment.trim()
                ? "bg-red-600 text-[var(--color-text-primary)] hover:bg-red-700"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            Confirm Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;
