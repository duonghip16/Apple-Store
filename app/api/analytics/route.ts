import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await getDatabase()

    const [orders, products, users, reviews] = await Promise.all([
      db.collection("orders").find({}).toArray(),
      db.collection("products").find({}).toArray(),
      db.collection("users").find({}).toArray(),
      db.collection("reviews").find({}).toArray()
    ])

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || order.totalAmount || 0), 0)
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length 
      : 0

    return NextResponse.json({
      success: true,
      data: {
        totalStats: {
          totalRevenue,
          totalOrders: orders.length
        },
        counts: {
          products: products.length,
          users: users.length,
          reviews: reviews.length
        },
        reviewStats: {
          avgRating
        },
        salesByMonth: [],
        categoryStats: [],
        topProducts: []
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}
