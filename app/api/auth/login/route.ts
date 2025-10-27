import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getDatabase } from "@/lib/mongodb"

type User = {
  _id: string
  email: string
  password: string
  name: string
  role: "admin" | "customer"
  isActive?: boolean
  isApproved?: boolean
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email và mật khẩu là bắt buộc" },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const user = await db.collection<User>("users").findOne({ email })

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email hoặc mật khẩu không đúng" },
        { status: 401 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Email hoặc mật khẩu không đúng" },
        { status: 401 }
      )
    }

    // Check if user is active
    if (user.isActive === false) {
      return NextResponse.json(
        { success: false, message: "Tài khoản đã bị khóa" },
        { status: 403 }
      )
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      message: "Đăng nhập thành công",
      role: user.role,
      user: userWithoutPassword
    })
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Có lỗi xảy ra khi đăng nhập" },
      { status: 500 }
    )
  }
}
