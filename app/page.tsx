import KeyCard from "@/components/KeyCard";
import { MapPin } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-500" />
            <span className="font-bold text-xl text-gray-900">ShareKy</span>
          </div>
          <span className="text-sm text-gray-500">Simple Key Management</span>
        </div>

        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">ShareKy</h1>
          <p className="text-gray-600 leading-relaxed">
            Secure and convenient key storage.<br />
            Automatically manage daily, weekly, and monthly<br />
            key usage limits.
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-4">
          <KeyCard title="Key Ngày" description="Hết hạn sau 24h" type="daily" />
          <KeyCard title="Key Tuần" description="Hết hạn sau 7 ngày" type="weekly" />
          <KeyCard title="Key Tháng" description="Hết hạn sau 30 ngày" type="monthly" />
        </div>
      </div>
    </main>
  );
}
