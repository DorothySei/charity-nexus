"use client";

import { useEffect } from "react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  icon?: string;
  actionText?: string;
  onAction?: () => void;
  transactionHash?: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  icon = "🎉",
  actionText,
  onAction,
  transactionHash
}: SuccessModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-t-2xl p-6 text-center">
          <div className="text-6xl mb-4">{icon}</div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        
        {/* Content */}
        <div className="p-6 text-center">
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            {message}
          </p>
          
          {/* Transaction Hash Display */}
          {transactionHash && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-600 mb-3 font-medium">Transaction Hash:</p>
              <div className="flex items-center space-x-2">
                <code className="text-xs bg-white px-3 py-2 rounded border flex-1 break-all font-mono text-gray-800 border-gray-300 shadow-sm">
                  {transactionHash}
                </code>
                <a
                  href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-xs underline font-medium whitespace-nowrap"
                >
                  View on Etherscan
                </a>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            {actionText && onAction && (
              <button
                onClick={onAction}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
              >
                {actionText}
              </button>
            )}
            
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-200 transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-pink-400 rounded-full animate-pulse delay-300"></div>
      </div>
    </div>
  );
}
