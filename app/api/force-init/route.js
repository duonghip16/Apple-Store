import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST() {
  try {
    const db = await getDatabase();

    // Check if iPhone 16 Pro Max exists
    const existingProduct = await db.collection('products').findOne({ name: 'iPhone 16 Pro Max' });
    
    if (!existingProduct) {
      // Add iPhone 16 Pro Max to database
      const iphone16ProMax = {
        name: 'iPhone 16 Pro Max',
        category: 'iPhone',
        price: 34990000,
        originalPrice: 36990000,
        stock: 50,
        description: 'iPhone 16 Pro Max với chip A18 Pro, camera 64MP và thiết kế Titanium cao cấp',
        images: ['/16pm.png'],
        isActive: true,
        soldCount: 25,
        rating: 5.0,
        reviewCount: 150,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.collection('products').insertOne(iphone16ProMax);
    }

    // Get all products
    const products = await db.collection('products').find({}).toArray();

    return NextResponse.json({
      success: true,
      message: 'iPhone 16 Pro Max added successfully',
      data: products
    });

  } catch (error) {
    console.error('Force init error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}