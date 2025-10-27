"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { setupAdminSync } from "./sync-admin"
import OrdersTab from "./tabs/OrdersTab"
import CustomersTab from "./tabs/CustomersTab"
import ReviewsTab from "./tabs/ReviewsTab"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Eye,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Database,
  Bell,
  LogOut,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Play,
  Star,
  MessageSquare,
  Truck,
  Clock,
  AlertTriangle,
  FileText,
  BarChart3,
  Mail,
  Phone,
  Package2,
  Warehouse,
  UserCheck,
  UserX,
  CheckSquare,
  XSquare,
  Printer,
} from "lucide-react"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dbInitialized, setDbInitialized] = useState(false)
  const [initLoading, setInitLoading] = useState(false)
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [loginError, setLoginError] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [showOrderDetail, setShowOrderDetail] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [inventoryAlerts, setInventoryAlerts] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [dateRange, setDateRange] = useState("7d")

  const [analyticsData, setAnalyticsData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    productCount: 0,
    userCount: 0,
    reviewCount: 0,
    avgRating: 0,
    salesByMonth: [],
    categoryStats: [],
    topProducts: [],
    topRatedProducts: []
  })

  useEffect(() => {
    checkAuthStatus()
  }, [])

  useEffect(() => {
    return setupAdminSync(setAnalyticsData, setProducts);
  }, [])

  const checkAuthStatus = () => {
    setIsAuthenticated(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    
    try {
      const createAdminResponse = await fetch('/api/create-admin', { method: 'POST' })
      const createAdminResult = await createAdminResponse.json()
      
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
      })

      const data = await response.json()

      if (data.success && data.user.role === 'admin') {
        localStorage.setItem('admin', JSON.stringify(data.user))
        setIsAuthenticated(true)
        checkAndInitializeDatabase()
      } else {
        setLoginError(data.message || "Email hoặc mật khẩu không đúng hoặc không có quyền admin")
      }
    } catch (error: any) {
      console.error('Login error:', error)
      setLoginError("Có lỗi xảy ra khi đăng nhập: " + (error.message || 'Unknown error'))
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin')
    setIsAuthenticated(false)
    setDbInitialized(false)
    setLoginData({ email: "", password: "" })
  }

  const checkAndInitializeDatabase = async () => {
    try {
      const productsResponse = await fetch("/api/products")
      const productsData = await productsResponse.json()

      if (productsData.success && productsData.data.length > 0) {
        setDbInitialized(true)
        loadAllData()
      } else {
        await initializeDatabase()
      }
    } catch (error: any) {
      console.error("Error checking database:", error)
      setLoading(false)
    }
  }

  const initializeDatabase = async () => {
    setInitLoading(true)
    try {
      await fetch('/api/create-admin', { method: 'POST' })
      
      const response = await fetch("/api/init-database", {
        method: "POST",
      })
      const result = await response.json()

      if (result.success) {
        setDbInitialized(true)
        await loadAllData()
      } else {
        console.error("Failed to initialize database:", result.error)
      }
    } catch (error: any) {
      console.error("Error initializing database:", error)
    } finally {
      setInitLoading(false)
    }
  }

  const loadAllData = async () => {
    setLoading(true)
    try {
      const loadFromLocalStorage = () => {
        try {
          const productsData = localStorage.getItem('products')
          if (productsData) {
            setProducts(JSON.parse(productsData))
          }
          
          const ordersData = localStorage.getItem('orders')
          if (ordersData) {
            setOrders(JSON.parse(ordersData))
          } else {
            const sampleOrders = [
              { 
                _id: 'order1', 
                orderNumber: 'ORD001', 
                status: 'completed', 
                total: 34990000, 
                totalAmount: 34990000,
                createdAt: new Date(), 
                items: [{ name: 'iPhone 15 Pro Max', quantity: 1, price: 34990000 }],
                customerInfo: { name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', phone: '0901234567' },
                shippingAddress: { address: '123 Nguyễn Huệ, Q1, TP.HCM' },
                paymentMethod: 'credit_card',
                paymentStatus: 'paid'
              }
            ]
            setOrders(sampleOrders)
            localStorage.setItem('orders', JSON.stringify(sampleOrders))
          }
          
          const usersData = localStorage.getItem('users')
          if (usersData) {
            setUsers(JSON.parse(usersData))
          } else {
            const sampleUsers = [
              { 
                _id: 'user1', 
                name: 'Nguyễn Văn A', 
                email: 'nguyenvana@example.com', 
                role: 'customer', 
                isActive: true, 
                isApproved: true,
                createdAt: new Date(),
                phone: '0901234567',
                totalOrders: 5,
                totalSpent: 150000000
              }
            ]
            setUsers(sampleUsers)
            localStorage.setItem('users', JSON.stringify(sampleUsers))
          }

          const reviewsData = localStorage.getItem('reviews')
          if (reviewsData) {
            setReviews(JSON.parse(reviewsData))
          } else {
            const sampleReviews = [
              {
                _id: 'review1',
                productId: 'prod1',
                userId: 'user1',
                userName: 'Nguyễn Văn A',
                rating: 5,
                comment: 'Sản phẩm tuyệt vời!',
                isApproved: true,
                createdAt: new Date()
              }
            ]
            setReviews(sampleReviews)
            localStorage.setItem('reviews', JSON.stringify(sampleReviews))
          }
          
          const analyticsData = localStorage.getItem('analytics')
          if (analyticsData) {
            const parsedData = JSON.parse(analyticsData)
            setAnalyticsData({
              totalRevenue: parsedData.totalRevenue || 0,
              totalOrders: parsedData.totalOrders || 0,
              productCount: parsedData.productCount || 0,
              userCount: parsedData.userCount || 0,
              reviewCount: parsedData.reviewCount || 0,
              avgRating: parsedData.avgRating || 0,
              salesByMonth: parsedData.salesByMonth || [],
              categoryStats: parsedData.categoryStats || [],
              topProducts: parsedData.topProducts || [],
              topRatedProducts: parsedData.topRatedProducts || []
            })
          }

          generateNotifications()
          generateInventoryAlerts()
          generateRecentActivity()
        } catch (err) {
          console.error('Error loading from localStorage:', err)
        }
      }
      
      try {
        const productsResponse = await fetch("/api/products")
        const productsData = await productsResponse.json()
        if (productsData.success) {
          setProducts(productsData.data)
        }

        const ordersResponse = await fetch("/api/orders")
        const ordersData = await ordersResponse.json()
        if (ordersData.success) {
          setOrders(ordersData.data)
        }

        const usersResponse = await fetch("/api/users")
        if (!usersResponse.ok) {
          throw new Error(`HTTP error! status: ${usersResponse.status}`)
        }
        const usersData = await usersResponse.json()
        if (usersData.success) {
          setUsers(usersData.data)
        }

        const reviewsResponse = await fetch("/api/reviews")
        if (!reviewsResponse.ok) {
          console.error('Reviews API error:', reviewsResponse.status)
          throw new Error(`HTTP error! status: ${reviewsResponse.status}`)
        }
        const reviewsResult = await reviewsResponse.json()
        console.log('Reviews API response:', reviewsResult)
        if (reviewsResult.success) {
          console.log('Setting reviews:', reviewsResult.data)
          setReviews(reviewsResult.data || [])
        } else {
          console.error('Reviews API returned success=false')
          setReviews([])
        }
        
        const analyticsResponse = await fetch("/api/analytics")
        const analyticsResult = await analyticsResponse.json()
        if (analyticsResult.success) {
          setAnalyticsData({
            totalRevenue: analyticsResult.data.totalStats?.totalRevenue || 0,
            totalOrders: analyticsResult.data.totalStats?.totalOrders || 0,
            productCount: analyticsResult.data.counts?.products || 0,
            userCount: analyticsResult.data.counts?.users || 0,
            reviewCount: analyticsResult.data.counts?.reviews || 0,
            avgRating: analyticsResult.data.reviewStats?.avgRating || 0,
            salesByMonth: analyticsResult.data.salesByMonth || [],
            categoryStats: analyticsResult.data.categoryStats || [],
            topProducts: analyticsResult.data.topProducts || [],
            topRatedProducts: analyticsResult.data.topRatedProducts || []
          })
        }

        generateNotifications()
        generateInventoryAlerts()
        generateRecentActivity()
      } catch (apiError) {
        console.error("API error, falling back to localStorage:", apiError)
        loadFromLocalStorage()
      }
    } catch (error: any) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateNotifications = () => {
    const notifications = [
      {
        id: 1,
        type: 'order',
        title: 'Đơn hàng mới',
        message: 'Có 3 đơn hàng mới cần xử lý',
        time: new Date(),
        read: false,
        priority: 'high'
      }
    ]
    setNotifications(notifications)
  }

  const generateInventoryAlerts = () => {
    const alerts = [
      {
        id: 1,
        productId: 'prod1',
        productName: 'iPhone 15 Pro Max',
        currentStock: 5,
        minStock: 10,
        status: 'critical'
      }
    ]
    setInventoryAlerts(alerts)
  }

  const generateRecentActivity = () => {
    const activities = [
      {
        id: 1,
        type: 'order',
        action: 'Đơn hàng ORD001 đã được giao thành công',
        user: 'Nguyễn Văn A',
        time: new Date(),
        icon: CheckCircle,
        color: 'text-green-500'
      }
    ]
    setRecentActivity(activities)
  }

  const salesData = analyticsData.salesByMonth && analyticsData.salesByMonth.length > 0 ? 
    analyticsData.salesByMonth.map((item: any) => ({
      month: new Date(0, item._id?.month - 1).toLocaleString('default', { month: 'short' }),
      sales: item.totalSales || 0,
      orders: item.orderCount || 0
    })) : [
      { month: "Jan", sales: 4000000000, orders: 240 },
      { month: "Feb", sales: 3000000000, orders: 180 },
      { month: "Mar", sales: 5000000000, orders: 320 },
      { month: "Apr", sales: 4500000000, orders: 280 },
      { month: "May", sales: 6000000000, orders: 380 },
      { month: "Jun", sales: 5500000000, orders: 350 },
    ]

  const categoryColors = {
    "iPhone": "#3B82F6",
    "Mac": "#10B981",
    "iPad": "#F59E0B",
    "Apple Watch": "#EF4444",
    "AirPods": "#8B5CF6",
    "Phụ kiện": "#EC4899"
  }
  
  const categoryData = analyticsData.categoryStats && analyticsData.categoryStats.length > 0 ?
    analyticsData.categoryStats.map((item: any) => ({
      name: item._id || '',
      value: item.count || 0,
      color: item._id && typeof item._id === 'string' ? (categoryColors as any)[item._id] || "#3B82F6" : "#3B82F6"
    })) : [
      { name: "iPhone", value: 45, color: "#3B82F6" },
      { name: "Mac", value: 25, color: "#10B981" },
      { name: "iPad", value: 20, color: "#F59E0B" },
      { name: "Watch", value: 10, color: "#EF4444" },
    ]

  const stats = [
    {
      title: "Tổng doanh thu",
      value: "VND " + (analyticsData.totalRevenue || 0).toLocaleString(),
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "Đơn hàng",
      value: (analyticsData.totalOrders || orders.length).toString(),
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-blue-500",
    },
    {
      title: "Sản phẩm",
      value: (analyticsData.productCount || products.length).toString(),
      change: "+3.1%",
      trend: "up",
      icon: Package,
      color: "text-purple-500",
    },
    {
      title: "Khách hàng",
      value: (analyticsData.userCount || users.filter((u: any) => u.role === "customer").length).toString(),
      change: "+15.3%",
      trend: "up",
      icon: Users,
      color: "text-orange-500",
    },
    {
      title: "Đánh giá",
      value: (analyticsData.reviewCount || 0).toString(),
      change: "+24.8%",
      trend: "up",
      icon: Star,
      color: "text-yellow-500",
    },
    {
      title: "Điểm đánh giá",
      value: (analyticsData.avgRating || 0).toFixed(1) + "/5",
      change: "+0.3",
      trend: "up",
      icon: Star,
      color: "text-yellow-500",
    },
  ]

  const handleAddProduct = () => {
    setEditingProduct(null)
    setIsProductDialogOpen(true)
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct(product)
    setIsProductDialogOpen(true)
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return
    
    try {
      const response = await fetch('/api/products?id=' + productId, {
        method: "DELETE",
      })
      
      if (response.ok) {
        const updatedProducts = products.filter((p) => p._id !== productId)
        setProducts(updatedProducts)
        localStorage.setItem('products', JSON.stringify(updatedProducts))
        alert('Xóa sản phẩm thành công!')
      }
    } catch (error: any) {
      console.error("Error deleting product:", error)
      alert('Có lỗi xảy ra khi xóa sản phẩm')
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: orderId, status: newStatus })
      })
      
      if (response.ok) {
        const updatedOrders = orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        )
        setOrders(updatedOrders)
        localStorage.setItem('orders', JSON.stringify(updatedOrders))
        alert('Cập nhật trạng thái thành công!')
      }
    } catch (error: any) {
      console.error('Error updating order status:', error)
      alert('Có lỗi xảy ra khi cập nhật trạng thái')
    }
  }
  
  const deleteOrder = async (orderId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) return
    
    try {
      const response = await fetch('/api/orders?id=' + orderId, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        const updatedOrders = orders.filter(order => order._id !== orderId)
        setOrders(updatedOrders)
        localStorage.setItem('orders', JSON.stringify(updatedOrders))
        alert('Xóa đơn hàng thành công!')
      }
    } catch (error: any) {
      console.error('Error deleting order:', error)
      alert('Có lỗi xảy ra khi xóa đơn hàng')
    }
  }
  
  const approveUser = async (userId: string) => {
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: userId, isApproved: true })
      })
      
      if (response.ok) {
        const updatedUsers = users.map(user => 
          user._id === userId ? { ...user, isApproved: true } : user
        )
        setUsers(updatedUsers)
        localStorage.setItem('users', JSON.stringify(updatedUsers))
        alert('Duyệt khách hàng thành công!')
      }
    } catch (error: any) {
      console.error('Error approving user:', error)
      alert('Có lỗi xảy ra khi duyệt khách hàng')
    }
  }
  
  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: userId, isActive })
      })
      
      if (response.ok) {
        const updatedUsers = users.map(user => 
          user._id === userId ? { ...user, isActive } : user
        )
        setUsers(updatedUsers)
        localStorage.setItem('users', JSON.stringify(updatedUsers))
        alert(`${isActive ? 'Kích hoạt' : 'Khóa'} tài khoản thành công!`)
      }
    } catch (error: any) {
      console.error('Error toggling user status:', error)
      alert('Có lỗi xảy ra khi thay đổi trạng thái')
    }
  }
  
  const deleteUser = async (userId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) return
    
    try {
      const response = await fetch('/api/users?id=' + userId, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        const updatedUsers = users.filter(user => user._id !== userId)
        setUsers(updatedUsers)
        localStorage.setItem('users', JSON.stringify(updatedUsers))
        alert('Xóa khách hàng thành công!')
      }
    } catch (error: any) {
      console.error('Error deleting user:', error)
      alert('Có lỗi xảy ra khi xóa khách hàng')
    }
  }
  
  const approveReview = async (reviewId: string) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: reviewId, isApproved: true })
      })
      
      if (response.ok) {
        const updatedReviews = reviews.map(review => 
          review._id === reviewId ? { ...review, isApproved: true } : review
        )
        setReviews(updatedReviews)
        alert('Duyệt đánh giá thành công!')
      }
    } catch (error: any) {
      console.error('Error approving review:', error)
      alert('Có lỗi xảy ra khi duyệt đánh giá')
    }
  }
  
  const deleteReview = async (reviewId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) return
    
    try {
      const response = await fetch('/api/reviews?id=' + reviewId, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        const updatedReviews = reviews.filter(review => review._id !== reviewId)
        setReviews(updatedReviews)
        alert('Xóa đánh giá thành công!')
      }
    } catch (error: any) {
      console.error('Error deleting review:', error)
      alert('Có lỗi xảy ra khi xóa đánh giá')
    }
  }

  const handleSaveProduct = async (productData: any) => {
    try {
      const method = editingProduct ? "PUT" : "POST"
      const body = editingProduct ? { _id: editingProduct._id, ...productData } : productData

      const response = await fetch("/api/products", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      const result = await response.json()

      if (result.success) {
        const updatedProducts = editingProduct 
          ? products.map(p => p._id === editingProduct._id ? result.data : p)
          : [...products, result.data]
        
        setProducts(updatedProducts)
        localStorage.setItem('products', JSON.stringify(updatedProducts))
        
        setIsProductDialogOpen(false)
        alert('Sản phẩm đã được lưu thành công!')
      } else {
        alert('Lỗi: ' + result.error)
      }
    } catch (error: any) {
      console.error("Error saving product:", error)
      alert('Có lỗi xảy ra khi lưu sản phẩm')
    }
  }

  const filteredProducts = products.filter((product: any) => product.name?.toLowerCase().includes(searchTerm.toLowerCase()))

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            {loginError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {loginError}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Đăng nhập
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!dbInitialized && initLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Database className="h-16 w-16 mx-auto mb-4 text-blue-500 animate-pulse" />
            <h2 className="text-2xl font-bold mb-2">Đang khởi tạo Database</h2>
            <p className="text-gray-600 mb-4">Đang tạo dữ liệu mẫu cho hệ thống...</p>
            <div className="flex items-center justify-center">
              <RefreshCw className="h-5 w-5 animate-spin mr-2" />
              <span>Vui lòng đợi...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!dbInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-orange-500" />
            <h2 className="text-2xl font-bold mb-2">Database chưa được khởi tạo</h2>
            <p className="text-gray-600 mb-6">Hệ thống cần khởi tạo dữ liệu mẫu để hoạt động.</p>
            <Button onClick={initializeDatabase} disabled={initLoading} className="w-full">
              {initLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Đang khởi tạo...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Khởi tạo Database
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={"fixed inset-y-0 left-0 z-50 bg-white shadow-lg transition-all duration-300 cursor-pointer " + (sidebarOpen ? 'w-64' : 'w-16')}
        onClick={() => !sidebarOpen && setSidebarOpen(true)}>
        <div className="flex h-16 items-center justify-center border-b bg-gradient-to-r from-blue-600 to-purple-600 px-4">
          {sidebarOpen && (
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <img src="/favicon.png" alt="Logo" className="h-8 w-8" />
              <h1 className="text-xl font-bold text-white">Apple Admin</h1>
            </button>
          )}
          {!sidebarOpen && (
            <button 
              onClick={(e) => {
                e.stopPropagation()
                setActiveTab('dashboard')
              }}
              className="hover:opacity-80 transition-opacity">
              <img src="/favicon.png" alt="Logo" className="h-8 w-8" />
            </button>
          )}
        </div>

        <nav className="mt-8 space-y-2 px-4">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "products", label: "Sản phẩm", icon: Package },
            { id: "orders", label: "Đơn hàng", icon: ShoppingCart },
            { id: "customers", label: "Khách hàng", icon: Users },
            { id: "reviews", label: "Đánh giá", icon: MessageSquare },
            { id: "notifications", label: "Thông báo", icon: Bell, badge: notifications.filter(n => !n.read).length },
            { id: "database", label: "Database", icon: Database },
            { id: "settings", label: "Cài đặt", icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={"flex w-full items-center rounded-lg px-3 py-2 text-left transition-colors relative " + (sidebarOpen ? 'space-x-3' : 'justify-center') + " " + (activeTab === item.id ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900")}
              title={!sidebarOpen ? item.label : undefined}>
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
              {item.badge && item.badge > 0 && (
                <Badge className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button 
            variant="outline" 
            className={"w-full bg-transparent " + (!sidebarOpen ? 'px-2' : '')}
            onClick={handleLogout}>
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {sidebarOpen && <span className="ml-2">Đăng xuất</span>}
          </Button>
        </div>
      </div>

      <div className={"transition-all duration-300 " + (sidebarOpen ? 'ml-64' : 'ml-16')}>
        <header className="bg-white shadow-sm border-b">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                {activeTab === "dashboard" && "Dashboard"}
                {activeTab === "products" && "Quản lý sản phẩm"}
                {activeTab === "orders" && "Quản lý đơn hàng"}
                {activeTab === "customers" && "Quản lý khách hàng"}
                {activeTab === "reviews" && "Quản lý đánh giá"}
                {activeTab === "notifications" && "Thông báo"}
                {activeTab === "database" && "Quản lý Database"}
                {activeTab === "settings" && "Cài đặt hệ thống"}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => setActiveTab('notifications')}>
                <Bell className="h-5 w-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </Badge>
                )}
              </Button>
              
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {stats.map((stat, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                          <p className={"text-sm " + stat.color + " flex items-center mt-1"}>
                            {stat.trend === "up" ? (
                              <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                              <TrendingDown className="h-4 w-4 mr-1" />
                            )}
                            {stat.change}
                          </p>
                        </div>
                        <div className="p-3 rounded-full bg-gray-50">
                          <stat.icon className={"h-6 w-6 " + stat.color} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Doanh thu theo tháng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => ["VND " + value.toLocaleString(), "Doanh thu"]} />
                        <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Phân bố sản phẩm</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }: { name?: string, percent?: number }) => (name || "") + " " + (percent ? (percent * 100).toFixed(0) : 0) + "%"}>
                          {categoryData.map((entry, index) => (
                            <Cell key={"cell-" + index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Hoạt động gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.slice(0, 4).map((order: any, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium text-gray-900">Đơn hàng mới: {order.orderId}</p>
                          <p className="text-sm text-gray-600">
                            {order.customer?.name} - VND {order.total?.toLocaleString()}
                          </p>
                        </div>
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "default"
                              : order.status === "processing"
                                ? "secondary"
                                : "destructive"
                          }>
                          {order.status === "completed"
                            ? "Hoàn thành"
                            : order.status === "processing"
                              ? "Đang xử lý"
                              : "Chờ xử lý"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Thông báo hệ thống</h3>
                <Button variant="outline">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Đánh dấu tất cả đã đọc
                </Button>
              </div>

              <div className="space-y-4">
                {notifications.map((notification) => (
                  <Card key={notification.id} className={!notification.read ? "border-blue-200 bg-blue-50" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={"p-2 rounded-full " + (notification.priority === 'high' ? 'bg-red-100' : 'bg-blue-100')}>
                            <Bell className={"h-4 w-4 " + (notification.priority === 'high' ? 'text-red-600' : 'text-blue-600')} />
                          </div>
                          <div>
                            <h4 className="font-medium">{notification.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(notification.time).toLocaleString('vi-VN')}
                            </p>
                          </div>
                        </div>
                        {!notification.read && (
                          <Badge className="bg-blue-500">Mới</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "database" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Quản lý Database</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={initializeDatabase}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Khởi tạo lại DB
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Backup DB
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Sản phẩm</p>
                        <p className="text-2xl font-bold">{products.length}</p>
                      </div>
                      <Package className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Đơn hàng</p>
                        <p className="text-2xl font-bold">{orders.length}</p>
                      </div>
                      <ShoppingCart className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Người dùng</p>
                        <p className="text-2xl font-bold">{users.length}</p>
                      </div>
                      <Users className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Trạng thái Database</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h4 className="font-medium">Kết nối Database</h4>
                        <p className="text-sm text-gray-600">Trạng thái kết nối hiện tại</p>
                      </div>
                      <Badge variant="default">Hoạt động</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h4 className="font-medium">Backup tự động</h4>
                        <p className="text-sm text-gray-600">Sao lưu hàng ngày lúc 2:00 AM</p>
                      </div>
                      <Badge variant="default">Bật</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h4 className="font-medium">Dung lượng sử dụng</h4>
                        <p className="text-sm text-gray-600">Tổng dung lượng database</p>
                      </div>
                      <Badge variant="secondary">2.5 MB</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Cài đặt hệ thống</h3>
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  Lưu cài đặt
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cài đặt chung</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <h3 className="font-medium">Chế độ bảo trì</h3>
                          <p className="text-sm text-gray-600">Tạm dừng hoạt động website</p>
                        </div>
                        <Badge variant="destructive">Tắt</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <h3 className="font-medium">Đăng ký tài khoản</h3>
                          <p className="text-sm text-gray-600">Cho phép khách hàng đăng ký</p>
                        </div>
                        <Badge variant="default">Bật</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <h3 className="font-medium">Duyệt đánh giá</h3>
                          <p className="text-sm text-gray-600">Yêu cầu duyệt trước khi hiển thị</p>
                        </div>
                        <Badge variant="default">Bật</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Cài đặt thanh toán</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <h3 className="font-medium">Tiền mặt (COD)</h3>
                          <p className="text-sm text-gray-600">Thanh toán khi nhận hàng</p>
                        </div>
                        <Badge variant="default">Bật</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <h3 className="font-medium">Thẻ tín dụng</h3>
                          <p className="text-sm text-gray-600">Visa, Mastercard</p>
                        </div>
                        <Badge variant="default">Bật</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button variant="outline">Hủy</Button>
                <Button>Lưu cài đặt</Button>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <OrdersTab
              orders={orders}
              onUpdateStatus={updateOrderStatus}
              onDelete={deleteOrder}
              onRefresh={loadAllData}
            />
          )}

          {activeTab === "customers" && (
            <CustomersTab
              users={users}
              onApprove={approveUser}
              onToggleStatus={toggleUserStatus}
              onDelete={deleteUser}
              onRefresh={loadAllData}
            />
          )}

          {activeTab === "reviews" && (
            <ReviewsTab
              reviews={reviews}
              onApprove={approveReview}
              onDelete={deleteReview}
              onRefresh={loadAllData}
            />
          )}

          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Tìm kiếm sản phẩm..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Lọc
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Xuất Excel
                  </Button>
                  <Button onClick={handleAddProduct}>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm sản phẩm
                  </Button>
                  <Button variant="outline" onClick={loadAllData}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Tải lại
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead>Danh mục</TableHead>
                        <TableHead>Giá</TableHead>
                        <TableHead>Tồn kho</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Đã bán</TableHead>
                        <TableHead>Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product: any) => (
                        <TableRow key={product._id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>VND {product.price?.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={product.stock < 20 ? "destructive" : "secondary"}>{product.stock}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={product.isActive !== false ? "default" : "destructive"}>
                              {product.isActive !== false ? "Hoạt động" : "Tạm dừng"}
                            </Badge>
                          </TableCell>
                          <TableCell>{product.soldCount || 0}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product._id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => setIsProductDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ProductForm({ product, onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    category: product?.category || "",
    price: product?.price || "",
    stock: product?.stock || "",
    status: product?.status || "active",
    description: product?.description || "",
    images: product?.images || []
  })
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setUploading(true)
    const uploadedImages: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        const data = await response.json()
        if (data.success) {
          uploadedImages.push(data.url)
        }
      } catch (error: any) {
        console.error('Upload error:', error)
      }
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...uploadedImages]
    }))
    setUploading(false)
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_: any, i: number) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const productData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      isActive: formData.status === 'active',
      description: formData.description || 'Mô tả sản phẩm'
    }
    
    try {
      await onSave(productData)
    } catch (error: any) {
      console.error('Error saving product:', error)
      alert('Có lỗi xảy ra khi lưu sản phẩm')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Tên sản phẩm</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Danh mục</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="iPhone">iPhone</SelectItem>
              <SelectItem value="iPad">iPad</SelectItem>
              <SelectItem value="Mac">Mac</SelectItem>
              <SelectItem value="Apple Watch">Apple Watch</SelectItem>
              <SelectItem value="AirPods">AirPods</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Giá (VND)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="stock">Số lượng</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="status">Trạng thái</Label>
        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="inactive">Không hoạt động</SelectItem>
            <SelectItem value="low_stock">Hết hàng</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="images">Hình ảnh sản phẩm</Label>
        <Input
          id="images"
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
        />
        {uploading && <p className="text-sm text-gray-600 mt-1">Đang tải ảnh...</p>}
        
        {formData.images.length > 0 && (
          <div className="mt-2 grid grid-cols-3 gap-2">
            {formData.images.map((image: string, index: number) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={"Product " + (index + 1)}
                  className="w-full h-20 object-cover rounded border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={() => removeImage(index)}>
                  ×
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit">Lưu</Button>
      </div>
    </form>
  )
}