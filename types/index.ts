export interface Product {
  _id: string
  name: string
  category: string
  price: number
  stock: number
  isActive: boolean
  soldCount?: number
  images?: string[]
  description?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Order {
  _id: string
  orderId?: string
  orderNumber?: string
  status: string
  total?: number
  totalAmount?: number
  createdAt: Date
  items: OrderItem[]
  customerInfo: CustomerInfo
  shippingAddress?: Address
  paymentMethod?: string
  paymentStatus?: string
}

export interface OrderItem {
  name: string
  quantity: number
  price: number
}

export interface CustomerInfo {
  name: string
  email: string
  phone: string
}

export interface Address {
  address: string
  city?: string
  district?: string
}

export interface User {
  _id: string
  name: string
  email: string
  role: "admin" | "customer"
  isActive: boolean
  isApproved: boolean
  phone?: string
  createdAt: Date
}

export interface Review {
  _id: string
  productId: string
  userId: string
  userName: string
  rating: number
  comment: string
  isApproved: boolean
  createdAt: Date
}

export interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  productCount: number
  userCount: number
  reviewCount: number
  avgRating: number
  salesByMonth: any[]
  categoryStats: any[]
  topProducts: any[]
}
