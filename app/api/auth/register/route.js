import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getDatabase } from "@/lib/mongodb"

export async function POST(request) {
  try {
    const { email, password, name, phone } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, message: "Email, mật khẩu và tên là bắt buộc" },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const existingUser = await db.collection("users").findOne({ email })
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email đã được sử dụng" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = {
      email,
      password: hashedPassword,
      name,
      phone: phone || "",
      role: "customer",
      isApproved: false,
      isActive: false,
      createdAt: new Date()
    }
    
    const result = await db.collection("users").insertOne(newUser)

    return NextResponse.json({
      success: true,
      message: "Đăng ký thành công. Tài khoản đang chờ admin duyệt.",
      user: {
        id: result.insertedId,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    )
  }
}