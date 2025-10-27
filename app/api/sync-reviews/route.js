export async function POST(request) {
  try {
    const data = await request.json();
    
    // Lưu dữ liệu vào localStorage của server (nếu cần)
    // Trong môi trường thực tế, đây là nơi bạn sẽ lưu dữ liệu vào database
    
    // Log để debug
    console.log('Received sync data:', {
      productId: data.productId,
      rating: data.rating,
      reviewCount: data.reviewCount
    });
    
    // Trả về thành công ngay lập tức
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Reviews synced successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error syncing reviews:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Failed to sync reviews'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}