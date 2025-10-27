import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const db = await getDatabase();
    
    const { items, customerInfo, shippingAddress, paymentMethod, totalAmount } = await request.json();

    if (!items || !customerInfo || !shippingAddress || !paymentMethod || !totalAmount) {
      return NextResponse.json(
        { success: false, message: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }

    // Generate order number
    const orderCount = await db.collection('orders').countDocuments();
    const orderNumber = `ORD${String(orderCount + 1).padStart(6, '0')}`;

    // Map payment method
    const paymentMethodMap = {
      'cod': 'cash_on_delivery',
      'credit_card': 'credit_card',
      'bank_transfer': 'bank_transfer',
      'momo': 'momo'
    };

    // Create order
    const order = {
      orderNumber,
      userId: customerInfo.userId || null,
      customer: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone
      },
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      })),
      total: totalAmount,
      totalAmount,
      shippingAddress: {
        address: shippingAddress.address,
        city: shippingAddress.city,
        district: shippingAddress.district
      },
      paymentMethod: paymentMethodMap[paymentMethod] || 'cash_on_delivery',
      paymentStatus: 'pending',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('orders').insertOne(order);

    return NextResponse.json({
      success: true,
      message: 'Đặt hàng thành công',
      order: {
        _id: result.insertedId,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status
      }
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server: ' + error.message },
      { status: 500 }
    );
  }
}