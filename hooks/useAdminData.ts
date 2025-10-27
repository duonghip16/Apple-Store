import { useState, useEffect } from "react"
import { api } from "@/services/api"
import type { Product, Order, User, Review, AnalyticsData } from "@/types"

export function useAdminData() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    productCount: 0,
    userCount: 0,
    reviewCount: 0,
    avgRating: 0,
    salesByMonth: [],
    categoryStats: [],
    topProducts: []
  })
  const [loading, setLoading] = useState(true)

  const loadAll = async () => {
    setLoading(true)
    try {
      const [productsRes, ordersRes, usersRes, reviewsRes, analyticsRes] = await Promise.all([
        api.products.getAll(),
        api.orders.getAll(),
        api.users.getAll(),
        api.reviews.getAll(),
        api.analytics.get()
      ])

      if (productsRes.success) setProducts(productsRes.data)
      if (ordersRes.success) setOrders(ordersRes.data)
      if (usersRes.success) setUsers(usersRes.data)
      if (reviewsRes.success) setReviews(reviewsRes.data)
      if (analyticsRes.success) {
        setAnalytics({
          totalRevenue: analyticsRes.data.totalStats?.totalRevenue || 0,
          totalOrders: analyticsRes.data.totalStats?.totalOrders || 0,
          productCount: analyticsRes.data.counts?.products || 0,
          userCount: analyticsRes.data.counts?.users || 0,
          reviewCount: analyticsRes.data.counts?.reviews || 0,
          avgRating: analyticsRes.data.reviewStats?.avgRating || 0,
          salesByMonth: analyticsRes.data.salesByMonth || [],
          categoryStats: analyticsRes.data.categoryStats || [],
          topProducts: analyticsRes.data.topProducts || []
        })
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  return {
    products,
    orders,
    users,
    reviews,
    analytics,
    loading,
    setProducts,
    setOrders,
    setUsers,
    setReviews,
    refresh: loadAll
  }
}
