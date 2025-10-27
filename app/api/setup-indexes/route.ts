import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function POST() {
  try {
    const db = await getDatabase()

    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("products").createIndex({ name: "text", category: 1 })
    await db.collection("products").createIndex({ slug: 1 }, { unique: true, sparse: true })
    await db.collection("categories").createIndex({ slug: 1 }, { unique: true })
    await db.collection("orders").createIndex({ orderId: 1 }, { unique: true })
    await db.collection("orders").createIndex({ "customerInfo.email": 1 })
    await db.collection("carts").createIndex({ userId: 1 }, { unique: true })
    await db.collection("reviews").createIndex({ productId: 1, userId: 1 })

    return NextResponse.json({
      success: true,
      message: "Database indexes created successfully"
    })
  } catch (error: any) {
    console.error("Setup indexes error:", error)
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 })
  }
}
