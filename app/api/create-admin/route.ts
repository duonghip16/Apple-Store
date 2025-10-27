import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase()
    
    // Check if admin already exists
    const existingAdmin = await db.collection("users").findOne({ 
      email: "admin@applestore.vn",
      role: "admin" 
    })

    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: "Admin đã tồn tại",
        exists: true
      })
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12)
    
    const adminUser = {
      name: "Administrator",
      email: "admin@applestore.vn",
      password: hashedPassword,
      role: "admin",
      isActive: true,
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection("users").insertOne(adminUser)

    return NextResponse.json({
      success: true,
      message: "Admin được tạo thành công",
      adminId: result.insertedId,
      exists: false
    })

  } catch (error) {
    console.error("Create admin error:", error)
    return NextResponse.json({ 
      success: false, 
      message: "Có lỗi xảy ra khi tạo admin",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
