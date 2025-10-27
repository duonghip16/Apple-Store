import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, newPassword } = await request.json()

    if (!email || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Email và mật khẩu mới là bắt buộc' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const user = await db.collection('users').findOne({ email, role: 'customer' })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Email không tồn tại' },
        { status: 404 }
      )
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    await db.collection('users').updateOne(
      { email },
      { $set: { password: hashedPassword } }
    )

    return NextResponse.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công'
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { success: false, message: 'Có lỗi xảy ra' },
      { status: 500 }
    )
  }
}
