import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDatabase } from '@/lib/mongodb';

export async function POST() {
  try {
    const db = await getDatabase();

    const existingUser = await db.collection('users').findOne({ email: 'hip@gmail.com' });
    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: 'User already exists',
        user: { email: 'hip@gmail.com' }
      });
    }

    const hashedPassword = await bcrypt.hash('123', 12);
    
    const user = {
      email: 'hip@gmail.com',
      password: hashedPassword,
      name: 'Hip User',
      role: 'customer',
      isApproved: true,
      isActive: true,
      createdAt: new Date()
    };

    await db.collection('users').insertOne(user);

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: { 
        email: 'hip@gmail.com',
        name: 'Hip User',
        role: 'customer'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}