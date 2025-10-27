import { syncReviewsForAdmin } from "./sync-reviews";

// Hàm đồng bộ đánh giá cho Admin Dashboard
export function setupAdminSync(setAnalyticsData: any, setProducts: any) {
  // Đồng bộ đánh giá mỗi khi trang Admin được tải
  const syncReviews = () => {
    try {
      const result = syncReviewsForAdmin();
      if (result) {
        // Cập nhật state
        setAnalyticsData((prev: any) => ({
          ...prev,
          reviewCount: result.analytics.reviewCount,
          avgRating: result.analytics.avgRating
        }));
        
        // Cập nhật products state
        setProducts(result.products);
      }
    } catch (error) {
      console.error('Lỗi khi đồng bộ đánh giá cho Admin:', error);
    }
  };
  
  // Gọi hàm đồng bộ khi trang được tải
  syncReviews();
  
  // Đồng bộ định kỳ mỗi 5 giây
  const syncInterval = setInterval(syncReviews, 5000);
  
  return () => clearInterval(syncInterval);
}