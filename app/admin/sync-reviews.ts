// Hàm đồng bộ đánh giá cho Admin
export function syncReviewsForAdmin() {
  try {
    // Lấy dữ liệu từ localStorage
    const reviewsData = localStorage.getItem('reviews');
    if (!reviewsData) {
      // Tạo mảng rỗng nếu chưa có
      localStorage.setItem('reviews', JSON.stringify([]));
      return null;
    }
    
    const reviews = JSON.parse(reviewsData);
    
    // Cập nhật analytics
    const analyticsData = localStorage.getItem('analytics');
    let analytics = analyticsData ? JSON.parse(analyticsData) : {
      totalRevenue: 0,
      totalOrders: 0,
      productCount: 0,
      userCount: 0,
      reviewCount: 0,
      avgRating: 0,
      salesByMonth: [],
      categoryStats: [],
      topProducts: [],
      topRatedProducts: []
    };
    
    // Cập nhật số lượng đánh giá
    analytics.reviewCount = reviews.length;
    
    // Cập nhật điểm đánh giá trung bình
    if (reviews.length > 0) {
      analytics.avgRating = reviews.reduce((sum: number, review: any) => sum + (review.rating || 0), 0) / reviews.length;
    } else {
      analytics.avgRating = 0;
    }
    
    // Lưu lại analytics
    localStorage.setItem('analytics', JSON.stringify(analytics));
    
    // Cập nhật sản phẩm
    const productsData = localStorage.getItem('products');
    if (!productsData) return null;
    
    const products = JSON.parse(productsData);
    
    // Tạo map đánh giá theo sản phẩm
    const reviewsByProduct: {[key: string]: any[]} = {};
    reviews.forEach((review: any) => {
      const productId = review.productId;
      if (!reviewsByProduct[productId]) {
        reviewsByProduct[productId] = [];
      }
      reviewsByProduct[productId].push(review);
    });
    
    // Cập nhật rating và reviewCount cho từng sản phẩm
    products.forEach((product: any) => {
      const productId = product._id || product.id;
      const productReviews = reviewsByProduct[productId] || [];
      
      if (productReviews.length > 0) {
        product.rating = productReviews.reduce((sum: number, review: any) => sum + (review.rating || 0), 0) / productReviews.length;
        product.reviewCount = productReviews.length;
        product.reviews = productReviews.length;
      }
    });
    
    // Lưu lại products
    localStorage.setItem('products', JSON.stringify(products));
    
    console.log('Đã đồng bộ đánh giá cho Admin');
    return { analytics, products };
  } catch (error) {
    console.error('Lỗi khi đồng bộ đánh giá cho Admin:', error);
    return null;
  }
}