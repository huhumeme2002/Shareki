import KeyCard from "@/components/KeyCard";
import { ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl shadow-lg mb-6">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Kho Key Chia Sẻ
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Quản lý và sử dụng key của bạn một cách dễ dàng. 
            Mỗi key có thể được sử dụng 3 lần trước khi cần cập nhật mới.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <KeyCard
            title="Key Theo Ngày"
            type="daily"
            description="Dành cho sử dụng ngắn hạn 24h"
          />
          <KeyCard
            title="Key Theo Tuần"
            type="weekly"
            description="Thời hạn sử dụng 7 ngày"
          />
          <KeyCard
            title="Key Theo Tháng"
            type="monthly"
            description="Gói cao cấp 30 ngày"
          />
        </div>

        <div className="mt-12 text-center">
            <p className="text-sm text-gray-400">
                © 2024 ShareKy. All rights reserved.
            </p>
        </div>
      </div>
    </main>
  );
}
