"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Plus, RotateCcw, Loader2 } from "lucide-react";

interface KeyCardProps {
  title: string;
  description: string;
  type: "daily" | "weekly" | "monthly";
}

export default function KeyCard({ title, description, type }: KeyCardProps) {
  const [key, setKey] = useState("");
  const [usesLeft, setUsesLeft] = useState(0);
  const [isEditing, setIsEditing] = useState(true);
  const [copied, setCopied] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch key from database on mount
  useEffect(() => {
    fetchKey();
  }, [type]);

  const fetchKey = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/keys?type=${type}`);
      const data = await res.json();
      
      if (data.key && data.key.usesRemaining > 0) {
        setKey(data.key.keyValue);
        setUsesLeft(data.key.usesRemaining);
        setIsEditing(false);
      } else {
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Error fetching key:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKey = async () => {
    if (!inputValue.trim()) return;
    
    try {
      setLoading(true);
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, keyValue: inputValue.trim() }),
      });
      const data = await res.json();
      
      if (data.key) {
        setKey(data.key.keyValue);
        setUsesLeft(data.key.usesRemaining);
        setIsEditing(false);
        setShowInput(false);
        setInputValue("");
      }
    } catch (error) {
      console.error("Error saving key:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseKey = async () => {
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);

    try {
      const res = await fetch("/api/keys", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      
      if (data.key) {
        setUsesLeft(data.key.usesRemaining);
      }
    } catch (error) {
      console.error("Error updating key:", error);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      await fetch(`/api/keys?type=${type}`, { method: "DELETE" });
      setIsEditing(true);
      setKey("");
      setUsesLeft(0);
      setInputValue("");
      setShowInput(false);
    } catch (error) {
      console.error("Error deleting key:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border-l-4 border-l-gray-300 shadow-sm p-5 flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border-l-4 border-l-gray-300 shadow-sm p-5">
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-bold text-xl text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      {/* Content */}
      {isEditing || usesLeft <= 0 ? (
        <div className="text-center">
          {!showInput ? (
            <>
              <p className="text-gray-500 mb-4">
                {usesLeft <= 0 && key ? "Hết lượt sử dụng" : "Chưa có Key"}
              </p>
              <button
                onClick={() => setShowInput(true)}
                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
              >
                <Plus size={18} />
                Lưu Key Mới
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveKey()}
                placeholder="Dán key vào đây..."
                autoFocus
                className="w-full px-4 py-2.5 text-center border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleSaveKey}
                  disabled={!inputValue.trim()}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-2 px-5 rounded-lg transition-colors"
                >
                  Lưu
                </button>
                <button
                  onClick={() => setShowInput(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-5 rounded-lg transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Usage indicator */}
          <div className="flex justify-center gap-1.5 mb-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`h-1.5 w-8 rounded-full ${i < usesLeft ? "bg-blue-500" : "bg-gray-200"}`} />
            ))}
          </div>
          
          {/* Key display */}
          <div className="bg-gray-100 px-4 py-3 rounded-lg">
            <p className="font-mono text-sm text-center text-gray-800 truncate select-all">{key}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-center">
            <button
              onClick={handleUseKey}
              className={`flex items-center gap-2 font-semibold py-2 px-5 rounded-lg transition-all ${
                copied 
                  ? "bg-green-500 text-white" 
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {copied ? <><Check size={16} /> Đã Copy</> : <><Copy size={16} /> Sao chép</>}
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-lg bg-gray-200 hover:bg-red-100 text-gray-500 hover:text-red-500 transition-colors"
              title="Reset"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
