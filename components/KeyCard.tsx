"use client";

import { useState, useEffect } from "react";
import { Copy, Check, RotateCcw, Key as KeyIcon } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface KeyCardProps {
  title: string;
  type: "daily" | "weekly" | "monthly";
  description: string;
}

export default function KeyCard({ title, type, description }: KeyCardProps) {
  const [key, setKey] = useState<string>("");
  const [usesLeft, setUsesLeft] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");

  // Load state from local storage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem(`shareky_${type}_key`);
    const storedUses = localStorage.getItem(`shareky_${type}_uses`);

    if (storedKey && storedUses) {
      const uses = parseInt(storedUses);
      if (uses > 0) {
        setKey(storedKey);
        setUsesLeft(uses);
        setIsEditing(false);
      } else {
        // If uses are 0, we stay in editing mode (or reset)
        setIsEditing(true);
      }
    }
  }, [type]);

  const handleSaveKey = () => {
    if (!inputValue.trim()) return;
    
    const newKey = inputValue.trim();
    setKey(newKey);
    setUsesLeft(3);
    setIsEditing(false);
    
    localStorage.setItem(`shareky_${type}_key`, newKey);
    localStorage.setItem(`shareky_${type}_uses`, "3");
    setInputValue("");
  };

  const handleUseKey = () => {
    // Copy logic
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // Decrement logic
    const newUses = usesLeft - 1;
    setUsesLeft(newUses);
    localStorage.setItem(`shareky_${type}_uses`, newUses.toString());

    if (newUses <= 0) {
        // Clear key from storage effectively requiring new input next time (or now)
        // We delay the UI reset slightly or show a message?
        // The requirement says: "sau khi hết 3 lần sẽ yêu cầu người dùng cập nhập key mới."
        // So after this copy (which is the 3rd use), next interaction should ask for update.
        // However, for better UX, we usually let them see it's 0, then reset.
    }
  };

  const handleReset = () => {
    setIsEditing(true);
    setKey("");
    setUsesLeft(0);
    setInputValue("");
    localStorage.removeItem(`shareky_${type}_key`);
    localStorage.removeItem(`shareky_${type}_uses`);
  };

  // If uses are 0 and we are not editing, force reset mode
  useEffect(() => {
    if (!isEditing && usesLeft <= 0) {
        // We can either auto-switch to edit or show a "Renew" button
        // Requirement: "sau khi hết 3 lần sẽ yêu cầu người dùng cập nhập key mới."
    }
  }, [usesLeft, isEditing]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
          <KeyIcon size={24} />
        </div>
        <div>
            <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {isEditing || usesLeft <= 0 ? (
          <div className="space-y-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-sm text-gray-600 mb-2">
                    {usesLeft <= 0 && key ? "Hết lượt sử dụng. Vui lòng nhập Key mới." : "Chưa có Key. Vui lòng nhập Key mới."}
                </p>
            </div>
            <div className="space-y-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Dán Key vào đây..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              <button
                onClick={handleSaveKey}
                disabled={!inputValue.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Lưu & Sử dụng
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Số lượt còn lại</p>
                <div className="flex items-center justify-center gap-1">
                    {[...Array(3)].map((_, i) => (
                        <div 
                            key={i} 
                            className={twMerge(
                                "h-2 w-8 rounded-full transition-colors",
                                i < usesLeft ? "bg-green-500" : "bg-gray-200"
                            )}
                        />
                    ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">{usesLeft}/3 lượt</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="font-mono text-center text-lg truncate select-all text-gray-800">
                    {key.slice(0, 8)}••••{key.slice(-4)}
                </p>
            </div>

            <button
              onClick={handleUseKey}
              className={twMerge(
                "w-full flex items-center justify-center gap-2 font-medium py-3 px-4 rounded-lg transition-all",
                copied 
                    ? "bg-green-100 text-green-700" 
                    : "bg-gray-900 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl"
              )}
            >
              {copied ? (
                <>
                  <Check size={18} />
                  Đã sao chép!
                </>
              ) : (
                <>
                  <Copy size={18} />
                  Sao chép Key
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
