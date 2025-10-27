"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Star,
  Smartphone,
  Tablet,
  Laptop,
  Watch,
  Headphones,
  Tv,
  Brain,
  Cpu,
  Zap,
  Eye,
  Sparkles,
  Waves,
  Atom,
  Network,
  ChevronRight,
  Shield,
  Truck,
  Award,
  X,
  Plus,
  Minus,
  Menu,
  RefreshCw,
  CreditCard,
  Lock,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import Link from "next/link"

export default function AppleStoreAI() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
    checkUserAuth()
    syncReviewsWithAdmin()
    
    // Đồng bộ định kỳ mỗi 10 giây thay vì 5 giây
    const syncInterval = setInterval(() => {
      syncAllProductReviews()
    }, 10000)
    
    return () => clearInterval(syncInterval)
  }, [])

  const checkUserAuth = async () => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        if (user.role === 'customer') {
          setCurrentUser(user)
          setIsUserLoggedIn(true)
        } else {
          setIsUserLoggedIn(false)
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
        setIsUserLoggedIn(false)
      }
    } else {
      // Try to create user if not exists
      try {
        await fetch('/api/add-user', { method: 'POST' })
      } catch (error) {
        console.error('Error creating user:', error)
      }
      setIsUserLoggedIn(false)
    }
  }

  const fetchProducts = async () => {
    try {
      // Luôn gọi API để lấy dữ liệu mới nhất
      const response = await fetch("/api/products", {
        cache: 'no-store'
      })
      const data = await response.json()
      console.log('Fetched products:', data)
      
      if (data.success) {
        const productsData = data.data || []
        
        // Kiểm tra trong localStorage để giữ lại đánh giá
        const localStorageData = localStorage.getItem('products')
        if (localStorageData) {
          try {
            const storedProducts = JSON.parse(localStorageData)
            
            // Kết hợp dữ liệu từ API với đánh giá từ localStorage
            const mergedProducts = productsData.map((apiProduct: any) => {
              const storedProduct = storedProducts.find((p: any) => p._id === apiProduct._id)
              if (storedProduct) {
                return {
                  ...apiProduct,
                  rating: storedProduct.rating || apiProduct.rating,
                  reviewCount: storedProduct.reviewCount || apiProduct.reviewCount,
                  reviews: storedProduct.reviews || apiProduct.reviewCount
                }
              }
              return apiProduct
            })
            
            setProducts(mergedProducts)
            localStorage.setItem('products', JSON.stringify(mergedProducts))
          } catch (err) {
            console.error('Error merging products data:', err)
            setProducts(productsData)
            localStorage.setItem('products', JSON.stringify(productsData))
          }
        } else {
          setProducts(productsData)
          localStorage.setItem('products', JSON.stringify(productsData))
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      
      // Nếu có lỗi khi gọi API, thử lấy từ localStorage
      const productsData = localStorage.getItem('products')
      if (productsData) {
        try {
          const storedProducts = JSON.parse(productsData)
          setProducts(storedProducts)
        } catch (err) {
          console.error('Error parsing products from localStorage:', err)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  // Đồng bộ đánh giá với Admin
  const syncReviewsWithAdmin = () => {
    try {
      // Đảm bảo có dữ liệu reviews trong localStorage
      const reviewsData = localStorage.getItem('reviews')
      if (!reviewsData) {
        localStorage.setItem('reviews', JSON.stringify([]))
      }
      
      // Đảm bảo có dữ liệu analytics trong localStorage cho Admin
      const analyticsData = localStorage.getItem('analytics')
      if (!analyticsData) {
        const defaultAnalytics = {
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
        }
        localStorage.setItem('analytics', JSON.stringify(defaultAnalytics))
      }
      
      // Đồng bộ đánh giá cho tất cả sản phẩm
      syncAllProductReviews()
    } catch (error) {
      console.error('Error syncing reviews with admin:', error)
    }
  }
  
  // Đồng bộ đánh giá cho tất cả sản phẩm
  const syncAllProductReviews = () => {
    try {
      // Lấy dữ liệu từ localStorage
      const reviewsData = localStorage.getItem('reviews')
      if (!reviewsData) return
      
      const reviews = JSON.parse(reviewsData)
      
      // Cập nhật analytics
      const analyticsData = localStorage.getItem('analytics')
      let analytics = analyticsData ? JSON.parse(analyticsData) : {
        reviewCount: 0,
        avgRating: 0
      }
      
      // Cập nhật số lượng đánh giá
      analytics.reviewCount = reviews.length
      
      // Cập nhật điểm đánh giá trung bình
      if (reviews.length > 0) {
        analytics.avgRating = reviews.reduce((sum: number, review: any) => sum + (review.rating || 0), 0) / reviews.length
      }
      
      // Lưu lại analytics
      localStorage.setItem('analytics', JSON.stringify(analytics))
      
      // Cập nhật sản phẩm
      const productsData = localStorage.getItem('products')
      if (!productsData) return
      
      // Tạo bản sao của products để tránh thay đổi trực tiếp
      const products = JSON.parse(productsData)
      
      // Tạo map đánh giá theo sản phẩm
      const reviewsByProduct: {[key: string]: any[]} = {}
      reviews.forEach((review: any) => {
        const productId = review.productId
        if (!reviewsByProduct[productId]) {
          reviewsByProduct[productId] = []
        }
        reviewsByProduct[productId].push(review)
      })
      
      // Cập nhật rating và reviewCount cho từng sản phẩm
      let hasChanges = false
      const updatedProducts = products.map((product: any) => {
        const productId = product._id || product.id
        const productReviews = reviewsByProduct[productId] || []
        
        if (productReviews.length > 0) {
          const newRating = productReviews.reduce((sum: number, review: any) => sum + (review.rating || 0), 0) / productReviews.length
          const newReviewCount = productReviews.length
          
          // Chỉ cập nhật nếu có thay đổi
          if (product.rating !== newRating || product.reviewCount !== newReviewCount) {
            hasChanges = true
            return {
              ...product,
              rating: newRating,
              reviewCount: newReviewCount,
              reviews: newReviewCount
            }
          }
        }
        return product
      })
      
      // Chỉ lưu lại nếu có thay đổi
      if (hasChanges) {
        localStorage.setItem('products', JSON.stringify(updatedProducts))
        // Cập nhật state nếu có thay đổi
        setProducts(updatedProducts)
        console.log('Đã đồng bộ đánh giá cho tất cả sản phẩm')
      }
    } catch (error) {
      console.error('Lỗi khi đồng bộ đánh giá cho sản phẩm:', error)
    }
  }

  const [activeAnimation, setActiveAnimation] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const heroCanvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<any[]>([])

  // State management
  const [cartItems, setCartItems] = useState<any[]>([])
  const [wishlistItems, setWishlistItems] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [checkoutData, setCheckoutData] = useState({
    customerInfo: { name: '', email: '', phone: '' },
    shippingAddress: { address: '', city: '', district: '' },
    paymentMethod: 'cod'
  })
  const [productReviews, setProductReviews] = useState<any[]>([])
  const [userRating, setUserRating] = useState(5)
  const [userReview, setUserReview] = useState('')

  // Neural network animation for hero
  useEffect(() => {
    const canvas = heroCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const particles: any[] = []
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
      })
    }

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.02)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, i) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${210 + Math.sin(Date.now() * 0.001 + i) * 30}, 70%, 60%, ${particle.opacity})`
        ctx.fill()

        // Draw connections
        particles.forEach((otherParticle, j) => {
          if (i !== j) {
            const dx = particle.x - otherParticle.x
            const dy = particle.y - otherParticle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 120) {
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              ctx.strokeStyle = `rgba(59, 130, 246, ${(1 - distance / 120) * 0.3})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        })
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  // Hero product (separate from database products)
  const heroProduct = {
    id: 'hero-iphone-16-pro-max',
    _id: 'hero-iphone-16-pro-max',
    name: 'iPhone 16 Pro Max',
    price: '34.990.000',
    originalPrice: '36.990.000',
    image: '/16pm.png',
    badge: 'Hero Product',
    badgeColor: 'bg-gradient-to-r from-blue-500 to-purple-500',
    rating: 5.0,
    reviews: 2024,
    features: ['A18 Pro Chip', 'Titanium Design', '64MP Camera'],
    category: 'iphone',
    slug: 'iphone-16-pro-max-hero',
    isActive: true,
    description: 'iPhone 16 Pro Max là sản phẩm cao cấp nhất của Apple với chip A18 Pro, màn hình Super Retina XDR 6.9 inch, hệ thống camera chuyên nghiệp 48MP và công nghệ AI tiên tiến. Thiết kế titanium bền bỉ, sang trọng và pin lên đến 29 giờ sử dụng.'
  }

  // Combine hero product with database products
  const databaseProducts = products.map((p: any) => ({
    id: p._id || `product-${Math.random().toString(36).substr(2, 9)}`,
    _id: p._id,
    name: p.name,
    price: p.price?.toLocaleString(),
    originalPrice: p.originalPrice?.toLocaleString(),
    image: p.images?.[0] || "/placeholder.svg",
    badge: p.isActive === false ? "Tạm dừng" : "New",
    badgeColor: p.isActive === false ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-gradient-to-r from-blue-500 to-purple-500",
    rating: p.rating || 4.5,
    reviews: p.reviewCount || 0,
    features: [p.category, "Latest Model", "Premium Quality"],
    category: p.category?.toLowerCase(),
    slug: p.name?.toLowerCase().replace(/\s+/g, '-'),
    status: p.isActive ? "active" : "inactive",
    isActive: p.isActive,
    description: p.description || ""
  }))

  const allProducts = [heroProduct, ...databaseProducts]

  // Calculate product counts and status by category (including hero product)
  const getCategoryStats = (categoryName: string) => {
    const categoryProducts = allProducts.filter((p: any) => 
      p.category?.toLowerCase() === categoryName.toLowerCase()
    )
    const activeCount = categoryProducts.filter((p: any) => p.isActive === true).length
    const totalCount = categoryProducts.length
    return { total: totalCount, active: activeCount }
  }

  const categories = [
    { name: "iPhone", icon: Smartphone, stats: getCategoryStats("iPhone"), color: "from-blue-500 to-purple-500", slug: "iphone" },
    { name: "iPad", icon: Tablet, stats: getCategoryStats("iPad"), color: "from-green-500 to-blue-500", slug: "ipad" },
    { name: "Mac", icon: Laptop, stats: getCategoryStats("Mac"), color: "from-purple-500 to-pink-500", slug: "mac" },
    { name: "Apple Watch", icon: Watch, stats: getCategoryStats("Apple Watch"), color: "from-orange-500 to-red-500", slug: "watch" },
    { name: "AirPods", icon: Headphones, stats: getCategoryStats("AirPods"), color: "from-cyan-500 to-blue-500", slug: "airpods" },
    { name: "Phụ kiện", icon: Tv, stats: getCategoryStats("Phụ kiện"), color: "from-indigo-500 to-purple-500", slug: "accessories" },
  ]

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.length > 0) {
      const suggestions = allProducts
        .filter(
          (product: any) =>
            product.name?.toLowerCase().includes(query.toLowerCase()) ||
            product.category?.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 5)
      setSearchSuggestions(suggestions)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  // Cart functionality
  const addToCart = (product: any) => {
    if (!isUserLoggedIn) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng')
      return
    }
    
    const productId = product._id || product.id
    const existingItem = cartItems.find((item: any) => (item._id || item.id) === productId)
    if (existingItem) {
      setCartItems(cartItems.map((item: any) => ((item._id || item.id) === productId ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1, uniqueKey: productId }])
    }
  }

  const removeFromCart = (productId: number | string) => {
    setCartItems(cartItems.filter((item: any) => item.id !== productId))
  }

  const updateQuantity = (productId: number | string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId)
    } else {
      setCartItems(cartItems.map((item: any) => (item.id === productId ? { ...item, quantity: newQuantity } : item)))
    }
  }

  // Wishlist functionality
  const toggleWishlist = (product: any) => {
    if (!isUserLoggedIn) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích')
      return
    }
    
    const productId = product._id || product.id // Use _id first, fallback to id
    const isInWishlist = wishlistItems.some((item: any) => (item._id || item.id) === productId)
    if (isInWishlist) {
      setWishlistItems(wishlistItems.filter((item: any) => (item._id || item.id) !== productId))
    } else {
      setWishlistItems([...wishlistItems, { ...product, uniqueKey: productId }])
    }
  }

  const isInWishlist = (productId: number | string) => {
    return wishlistItems.some((item: any) => (item._id || item.id) === productId)
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Giỏ hàng trống')
      return
    }
    setShowCheckout(true)
  }

  const processCheckout = async () => {
    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item._id || item.id,
          name: item.name,
          price: Number.parseFloat(item.price?.replace(/\./g, "") || "0"),
          quantity: item.quantity,
          image: item.image
        })),
        customerInfo: {
          ...checkoutData.customerInfo,
          userId: currentUser?.id || currentUser?._id
        },
        shippingAddress: checkoutData.shippingAddress,
        paymentMethod: checkoutData.paymentMethod,
        totalAmount: cartTotal
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      const result = await response.json()

      if (result.success) {
        alert(`Đặt hàng thành công! Mã đơn: ${result.order.orderNumber}`)
        setCartItems([])
        setShowCheckout(false)
        setCheckoutData({
          customerInfo: { name: '', email: '', phone: '' },
          shippingAddress: { address: '', city: '', district: '' },
          paymentMethod: 'cod'
        })
      } else {
        alert('Lỗi: ' + result.message)
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi đặt hàng')
    }
  }
  
  // Fetch product reviews
  const fetchProductReviews = async (productId: string) => {
    try {
      console.log('Fetching reviews for product:', productId)
      
      const response = await fetch('/api/reviews')
      const result = await response.json()
      
      if (result.success) {
        // Lọc đánh giá cho sản phẩm này và chỉ lấy đã duyệt
        const productReviews = result.data.filter((r: any) => 
          r.productId === productId && r.isApproved === true
        )
        setProductReviews(productReviews)
      } else {
        setProductReviews([])
      }
    } catch (error: any) {
      console.error('Error fetching reviews:', error)
      setProductReviews([])
    }
  }
  
  // Submit review
  const submitReview = async () => {
    if (!isUserLoggedIn || !currentUser || !selectedProduct) {
      alert('Vui lòng đăng nhập để đánh giá sản phẩm')
      return
    }
    
    try {
      // Tạo đánh giá mới và lưu vào database
      const reviewData = {
        productId: selectedProduct._id || selectedProduct.id,
        productName: selectedProduct.name,
        userId: currentUser._id || currentUser.id,
        userName: currentUser.name || 'Khách hàng',
        rating: userRating,
        comment: userReview,
        isApproved: false
      }
      
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Cập nhật danh sách đánh giá
        const newReview = result.data
        const newReviews = [newReview, ...productReviews]
        setProductReviews(newReviews)
        
        // Cập nhật rating sản phẩm trong UI
        const updatedProduct = {...selectedProduct}
        updatedProduct.rating = newReviews.reduce((sum: number, review: any) => sum + (review.rating || 0), 0) / newReviews.length
        updatedProduct.reviews = newReviews.length
        updatedProduct.reviewCount = newReviews.length
        setSelectedProduct(updatedProduct)
        
        // Cập nhật trong localStorage
        updateLocalStorage(newReview, updatedProduct)
        
        alert('Đánh giá của bạn đã được gửi thành công và đang chờ duyệt!')
        setUserReview('')
        setUserRating(5)
      } else {
        alert('Lỗi: ' + result.error)
      }
    } catch (error: any) {
      console.error('Error submitting review:', error)
      alert('Có lỗi xảy ra khi gửi đánh giá')
    }
  }
  
  // Cập nhật dữ liệu trong localStorage
  const updateLocalStorage = (newReview: any, updatedProduct: any) => {
    try {
      // Lưu đánh giá vào localStorage
      const reviewsData = localStorage.getItem('reviews') 
      let reviews = reviewsData ? JSON.parse(reviewsData) : []
      reviews.push(newReview)
      localStorage.setItem('reviews', JSON.stringify(reviews))
      
      // Cập nhật sản phẩm trong localStorage
      const productsData = localStorage.getItem('products')
      if (!productsData) return
      
      let products = JSON.parse(productsData)
      
      const productId = updatedProduct._id || updatedProduct.id
      
      // Tạo bản sao mới của mảng sản phẩm thay vì thay đổi trực tiếp
      const updatedProducts = products.map((p: any) => {
        if ((p._id || p.id) === productId) {
          return {
            ...p,
            rating: updatedProduct.rating,
            reviews: updatedProduct.reviews,
            reviewCount: updatedProduct.reviews
          }
        }
        return p
      })
      
      localStorage.setItem('products', JSON.stringify(updatedProducts))
      
      // Cập nhật state để UI hiển thị ngay lập tức
      setProducts(updatedProducts)
      
      // Cập nhật analytics
      const analyticsData = localStorage.getItem('analytics')
      let analytics = analyticsData ? JSON.parse(analyticsData) : {
        reviewCount: 0,
        avgRating: 0
      }
      
      analytics.reviewCount = (analytics.reviewCount || 0) + 1
      analytics.avgRating = reviews.reduce((sum: number, review: any) => sum + (review.rating || 0), 0) / reviews.length
      
      localStorage.setItem('analytics', JSON.stringify(analytics))
    } catch (err) {
      console.error('Error updating localStorage:', err)
    }
  }
  
  // Cập nhật dữ liệu trực tiếp vào Admin
  const updateAdminData = async (newReview: any, updatedProduct: any) => {
    try {
      // Tạo bản sao của dữ liệu để gửi đi
      const adminData = {
        review: newReview,
        productId: updatedProduct._id || updatedProduct.id,
        rating: updatedProduct.rating,
        reviewCount: updatedProduct.reviews,
        reviews: [...productReviews, newReview]
      }
      
      // Gửi dữ liệu đến API
      const response = await fetch('/api/sync-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminData)
      })
      
      if (!response.ok) {
        console.error('Failed to sync with admin:', response.status)
      }
    } catch (err) {
      console.error('Error updating admin data:', err)
    }
  }

  // Filter products by category
  const filteredProducts =
    selectedCategory === "all"
      ? allProducts
      : allProducts.filter((product: any) => product.category === selectedCategory)

  const cartTotal = cartItems.reduce((total: number, item: any) => {
    return total + Number.parseFloat(item.price?.replace(/\./g, "") || "0") * item.quantity
  }, 0)

  const cartCount = cartItems.reduce((total: number, item: any) => total + item.quantity, 0)

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20"></div>
        <div className="tech-grid"></div>
      </div>

      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo with animation */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                <span className="text-white font-bold text-lg animate-pulse">🍎</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Hip Store
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {categories.map((category) => (
                <button
                  key={category.slug}
                  onClick={() => {
                    setSelectedCategory(category.slug)
                    document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-gray-300 hover:text-white font-medium transition-all duration-300 hover:scale-105 relative group"
                >
                  {category.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </button>
              ))}
            </nav>

            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              {/* Enhanced Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm với AI..."
                  value={searchQuery || ""}
                  onChange={(e) => handleSearch(e.target.value || "")}
                  onFocus={() => searchQuery && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="pl-10 w-64 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:bg-white/20 transition-all"
                />

                {/* Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-xl z-50">
                    {searchSuggestions.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center p-3 hover:bg-white/10 cursor-pointer transition-colors"
                        onClick={() => {
                          setSearchQuery(product.name)
                          setShowSuggestions(false)
                        }}
                      >
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="rounded-lg mr-3"
                        />
                        <div>
                          <p className="text-white font-medium">{product.name}</p>
                          <p className="text-gray-400 text-sm">₫{product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Wishlist Button */}
              <Sheet open={isWishlistOpen} onOpenChange={setIsWishlistOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-white/10 transition-all hover:scale-110 relative"
                  >
                    <Heart className={`w-5 h-5 ${wishlistItems.length > 0 ? "fill-red-500 text-red-500" : ""}`} />
                    {wishlistItems.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                        {wishlistItems.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-black/90 backdrop-blur-md border-white/20 text-white flex flex-col">
                  <SheetHeader className="flex-shrink-0">
                    <SheetTitle className="text-white">Sản phẩm yêu thích</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {wishlistItems.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">Chưa có sản phẩm yêu thích</p>
                    ) : (
                      wishlistItems.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={60}
                            height={60}
                            className="rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-blue-400">₫{item.price}</p>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <Button size="sm" onClick={() => addToCart(item)} className="bg-blue-600 hover:bg-blue-700">
                              <ShoppingCart className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleWishlist(item)}
                              className="text-red-500 hover:bg-red-500/20"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              <Link href="/user">
                <Button variant="ghost" size="icon" className="hover:bg-white/10 transition-all hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </Button>
              </Link>

              {/* Shopping Cart */}
              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-white/10 transition-all hover:scale-110"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse">
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-black/90 backdrop-blur-md border-white/20 text-white w-96 flex flex-col">
                  <SheetHeader className="flex-shrink-0">
                    <SheetTitle className="text-white">Giỏ hàng ({cartCount})</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {cartItems.length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-400">Giỏ hàng trống</p>
                      </div>
                    ) : (
                      cartItems.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={60}
                            height={60}
                            className="rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            <p className="text-blue-400 text-sm">₫{item.price}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 p-0 hover:bg-white/20"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 p-0 hover:bg-white/20"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:bg-red-500/20"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>

                  {cartItems.length > 0 && (
                    <div className="border-t border-white/20 pt-4 mt-4 flex-shrink-0">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Tổng cộng:</span>
                        <span className="text-xl font-bold text-blue-400">₫{cartTotal.toLocaleString()}</span>
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        onClick={() => {
                          if (!isUserLoggedIn) {
                            alert('Vui lòng đăng nhập để thanh toán')
                            return
                          }
                          handleCheckout()
                        }}
                      >
                        Thanh toán
                      </Button>
                    </div>
                  )}
                </SheetContent>
              </Sheet>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden hover:bg-white/10">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-black/90 backdrop-blur-md border-white/20 text-white">
                  <SheetHeader>
                    <SheetTitle className="text-white">Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="mt-6 space-y-4">
                    {categories.map((category) => (
                      <button
                        key={category.slug}
                        onClick={() => {
                          setSelectedCategory(category.slug)
                          document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })
                        }}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors w-full text-left"
                      >
                        <category.icon className="w-5 h-5" />
                        <span>{category.name}</span>
                      </button>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Add padding top to account for fixed header */}
      <div className="pt-16">
        {/* Hero Section with Neural Network */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <canvas ref={heroCanvasRef} className="absolute inset-0 w-full h-full" />

          <div className="relative z-10 container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Powered Technology
                  </Badge>
                  <h1 className="text-6xl lg:text-6xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent animate-fade-in">
                      iPhone 16 Pro Max
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-slide-up">
                      Titanium
                    </span>
                  </h1>
                  <p className="text-xl text-gray-300 max-w-lg animate-slide-up" style={{ animationDelay: "0.3s" }}>
                  Trang bị chip A18 Pro với Neural Engine 20-core, hiệu suất AI thế hệ mới vượt trội
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "0.6s" }}>
                  <Button
                    size="lg"
                    onClick={() => addToCart(heroProduct)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Thêm vào giỏ
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => toggleWishlist(heroProduct)}
                    className="bg-black border-gray-800 hover:text-pink hover:bg-purple-400 transform hover:scale-105 transition-all duration-300"
                  >
                    <Heart
                      className={`w-4 h-4 mr-2 text-red-500 ${isInWishlist(heroProduct.id) ? "fill-red-500" : ""}`}
                    />
                    Yêu thích
                  </Button>
                </div>

                {/* Tech Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8 animate-slide-up" style={{ animationDelay: "0.9s" }}>
                  {[
                    { icon: Brain, label: "AI Neural", value: "20-core" },
                    { icon: Zap, label: "Performance", value: "30% faster" },
                    { icon: Eye, label: "Camera AI", value: "64MP Pro" },
                  ].map((stat: any, index: number) => (
                    <div key={index} className="text-center group">
                      <stat.icon className="w-8 h-8 mx-auto mb-2 text-blue-400 group-hover:scale-110 transition-transform" />
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="hologram-container">
                  <div className="hologram-device">
                    <Image
                      src="/16pm.png?height=500&width=350"
                      alt="iPhone 16 Pro Max"
                      width={350}
                      height={500}
                      priority
                      style={{ height: 'auto' }}
                      className="mx-auto transform hover:scale-105 transition-all duration-500"
                    />
                    <div className="hologram-overlay"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <Sparkles className="absolute top-20 left-20 w-6 h-6 text-yellow-400 animate-pulse" />
            <Brain className="absolute top-40 right-20 w-8 h-8 text-blue-400 animate-bounce" />
            <Cpu className="absolute bottom-40 left-40 w-6 h-6 text-green-400 animate-spin" />
            <Atom className="absolute bottom-20 right-40 w-7 h-7 text-purple-400 animate-pulse" />
          </div>
        </section>

        {/* Categories with Hover Effects */}
        <section className="relative z-10 py-20" id="categories">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Danh mục sản phẩm
                </span>
              </h2>
              <p className="text-gray-400">Khám phá thế giới công nghệ Apple</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category, index) => (
                <Card
                  key={index}
                  className={`group bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2 ${
                    selectedCategory === category.slug ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedCategory(category.slug)}
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center group-hover:rotate-12 transition-all duration-300`}
                    >
                      <category.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2 text-white group-hover:text-blue-300 transition-colors">
                      {category.name}
                    </h3>
                    <div className="text-sm space-y-1">
                      <p className="text-gray-300">{category.stats.total} sản phẩm</p>
                      <div className="flex justify-center space-x-2 text-xs">
                        <span className="text-green-400">{category.stats.active} hoạt động</span>
                        {category.stats.total - category.stats.active > 0 && (
                          <span className="text-red-400">{category.stats.total - category.stats.active} tạm dừng</span>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products with Advanced Animations */}
        <section className="relative z-10 py-20" id="products">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-16">
              <div>
                <h2 className="text-4xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {selectedCategory === "all"
                      ? "Sản phẩm nổi bật"
                      : `${categories.find((c) => c.slug === selectedCategory)?.name || "Sản phẩm"}`}
                  </span>
                </h2>
                <p className="text-gray-400">Được trang bị công nghệ AI tiên tiến</p>
              </div>
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                onClick={() => setSelectedCategory("all")}
              >
                Xem tất cả
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <Card
                  key={product.id}
                  className="group bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-4 overflow-hidden cursor-pointer"
                  onClick={() => {
                    setSelectedProduct(product)
                    if (product._id) {
                      fetchProductReviews(product._id)
                    }
                  }}
                >
                  <CardHeader className="p-0 relative overflow-hidden">
                    <div className="relative">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <Badge className={`absolute top-4 left-4 ${product.badgeColor} text-white animate-pulse`}>
                        {product.badge}
                      </Badge>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => toggleWishlist(product)}
                        className="absolute top-4 right-4 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 bg-black/70 hover:bg-black"
                      >
                        <Heart className={`w-4 h-4 text-red-500 ${isInWishlist(product.id) ? "fill-red-500" : ""}`} />
                      </Button>

                      {/* Hover overlay with features */}
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <h4 className="font-semibold mb-2">Tính năng nổi bật</h4>
                          <ul className="text-sm space-y-1">
                            {product.features.map((feature: string, i: number) => (
                              <li key={i} className="flex items-center justify-center">
                                <Zap className="w-3 h-3 mr-1 text-blue-400" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 text-white group-hover:text-blue-300 transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm font-medium text-white">{product.rating?.toFixed(1) || "0.0"}</span>
                      </div>
                      <span className="text-sm text-gray-400 ml-2">({product.reviews || 0} đánh giá)</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-red-400">₫{product.price}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">₫{product.originalPrice}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
                        onClick={() => addToCart(product)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Thêm vào giỏ
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => toggleWishlist(product)}
                        className="bg-black border-gray-800 hover:bg-gray-900"
                      >
                        <Heart className={`w-4 h-4 text-red-500 ${isInWishlist(product.id) ? "fill-red-500" : ""}`} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* AI Features Section */}
        <section className="relative z-10 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Công nghệ AI tiên tiến
                </span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Trải nghiệm sức mạnh của trí tuệ nhân tạo trong từng sản phẩm Apple
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Brain,
                  title: "Neural Engine",
                  desc: "16-core Neural Engine xử lý 15.8 nghìn tỷ phép tính/giây",
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  icon: Eye,
                  title: "Computer Vision",
                  desc: "Nhận diện đối tượng và xử lý hình ảnh thông minh",
                  color: "from-purple-500 to-pink-500",
                },
                {
                  icon: Waves,
                  title: "Machine Learning",
                  desc: "Học máy tối ưu hóa hiệu suất và trải nghiệm người dùng",
                  color: "from-green-500 to-blue-500",
                },
                {
                  icon: Network,
                  title: "Edge Computing",
                  desc: "Xử lý AI trực tiếp trên thiết bị, bảo mật tuyệt đối",
                  color: "from-orange-500 to-red-500",
                },
              ].map((feature: any, i: number) => (
                <Card
                  key={i}
                  className="group bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:rotate-12 transition-all duration-300`}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2 group-hover:text-blue-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                    <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="relative z-10 py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: "Bảo hành chính hãng",
                  desc: "12 tháng bảo hành toàn cầu",
                  color: "from-green-500 to-emerald-500",
                },
                {
                  icon: Truck,
                  title: "Giao hàng miễn phí",
                  desc: "Miễn phí giao hàng toàn quốc",
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  icon: Award,
                  title: "Chất lượng đảm bảo",
                  desc: "100% sản phẩm chính hãng Apple",
                  color: "from-purple-500 to-pink-500",
                },
              ].map((item: any, index: number) => (
                <Card
                  key={index}
                  className="group bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center group-hover:rotate-12 transition-all duration-300`}
                    >
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2 group-hover:text-blue-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                    <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 bg-black/50 backdrop-blur-sm border-t border-white/10 py-16">
          <div className="container mx-auto px-10">
            <div className="grid md:grid-cols-3 gap-10">
              {/* Company Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">🍎</span>
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Hip Store
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  Cửa hàng Apple uy tín với công nghệ AI tiên tiến, mang đến trải nghiệm mua sắm thông minh và an toàn.
                </p>
                
              </div>

              {/* Products */}
              <div className="space-y-4 mx-auto">
                <h3 className="text-white font-semibold">Sản phẩm</h3>
                <ul className="space-y-2 text-sm">
                  {categories.map((category) => (
                    <li key={category.slug}>
                      <button
                        onClick={() => {
                          setSelectedCategory(category.slug)
                          document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })
                        }}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

             

              {/* Support */}
              <div className="space-y-4 mx-auto">
                <h3 className="text-white font-semibold">Hỗ trợ</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  
                  <li>
                    <Link href="/supports/about" className="hover:text-white transition-colors">
                      Giới thiệu
                    </Link>
                  </li>
                  <li>
                    <Link href="/supports/policy" className="hover:text-white transition-colors">
                      Chính sách
                    </Link>
                  </li>
                  <li>
                    <Link href="/supports/faq" className="hover:text-white transition-colors">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="/supports/guide" className="hover:text-white transition-colors">
                      Hướng dẫn
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/10 mt-12 pt-8 text-center">
              <p className="text-gray-400 text-sm">
                © 2025 Hip Store. Tất cả các quyền được bảo lưu.
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="bg-black/90 backdrop-blur-md border-white/20 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white">{selectedProduct.name}</DialogTitle>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Image
                    src={selectedProduct.image || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    width={400}
                    height={400}
                    className="w-full rounded-lg"
                  />
                  <div className="flex space-x-2">
                    <Button
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={() => addToCart(selectedProduct)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Thêm vào giỏ - ₫{selectedProduct.price}
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => toggleWishlist(selectedProduct)}
                      className="bg-black border-gray-800 hover:bg-gray-900"
                    >
                      <Heart className={`w-4 h-4 text-red-500 ${isInWishlist(selectedProduct.id) ? "fill-red-500" : ""}`} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(selectedProduct.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-lg font-medium">{selectedProduct.rating?.toFixed(1) || "0.0"}</span>
                      </div>
                      <span className="text-gray-400 ml-2">({selectedProduct.reviews || 0} đánh giá)</span>
                    </div>
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="text-3xl font-bold text-red-400">₫{selectedProduct.price}</span>
                      <span className="text-lg text-gray-500 line-through">₫{selectedProduct.originalPrice}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Mô tả sản phẩm</h4>
                    <p className="text-gray-300 leading-relaxed">
                      {selectedProduct.description || "Sản phẩm Apple chính hãng với chất lượng cao và công nghệ tiên tiến."}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Tính năng nổi bật</h4>
                    <ul className="space-y-2">
                      {selectedProduct.features?.map((feature: string, i: number) => (
                        <li key={i} className="flex items-center text-gray-300">
                          <Zap className="w-4 h-4 mr-2 text-blue-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Reviews Section */}
                  <div className="border-t border-white/20 pt-6">
                    <h4 className="font-semibold mb-4">Đánh giá sản phẩm</h4>
                    
                    {/* Add Review Form */}
                    {isUserLoggedIn && (
                      <div className="mb-6 p-4 bg-white/5 rounded-lg">
                        <h5 className="font-medium mb-3">Viết đánh giá của bạn</h5>
                        <div className="space-y-3">
                          <div>
                            <Label>Đánh giá</Label>
                            <div className="flex items-center space-x-1 mt-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => setUserRating(i + 1)}
                                  className="focus:outline-none"
                                >
                                  <Star
                                    className={`w-6 h-6 ${
                                      i < userRating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
                                    } hover:text-yellow-400 transition-colors`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <Label>Nhận xét</Label>
                            <Textarea
                              value={userReview}
                              onChange={(e) => setUserReview(e.target.value)}
                              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                              className="mt-1 bg-white/10 border-white/20 text-white"
                            />
                          </div>
                          <Button
                            onClick={submitReview}
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={!userReview.trim()}
                          >
                            Gửi đánh giá
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {productReviews.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">Chưa có đánh giá nào</p>
                      ) : (
                        productReviews.map((review) => (
                          <div key={review._id} className="p-3 bg-white/5 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{review.userName}</span>
                                <div className="flex items-center">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <span className="text-sm text-gray-400">
                                {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm">{review.comment}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Checkout Modal */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="bg-black/90 backdrop-blur-md border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">Thanh toán</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="space-y-4">
              <h3 className="font-semibold">Đơn hàng của bạn</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-2 bg-white/5 rounded">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="rounded"
                      />
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-gray-400 text-xs">Số lượng: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">₫{(Number.parseFloat(item.price?.replace(/\./g, "") || "0") * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/20 pt-2">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Tổng cộng:</span>
                  <span className="text-blue-400">₫{cartTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="space-y-4">
              <h3 className="font-semibold">Thông tin khách hàng</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Họ tên</Label>
                  <Input
                    value={checkoutData.customerInfo.name}
                    onChange={(e) => setCheckoutData({
                      ...checkoutData,
                      customerInfo: { ...checkoutData.customerInfo, name: e.target.value }
                    })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={checkoutData.customerInfo.email}
                    onChange={(e) => setCheckoutData({
                      ...checkoutData,
                      customerInfo: { ...checkoutData.customerInfo, email: e.target.value }
                    })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
              <div>
                <Label>Số điện thoại</Label>
                <Input
                  value={checkoutData.customerInfo.phone}
                  onChange={(e) => setCheckoutData({
                    ...checkoutData,
                    customerInfo: { ...checkoutData.customerInfo, phone: e.target.value }
                  })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-4">
              <h3 className="font-semibold">Địa chỉ giao hàng</h3>
              <div>
                <Label>Địa chỉ</Label>
                <Input
                  value={checkoutData.shippingAddress.address}
                  onChange={(e) => setCheckoutData({
                    ...checkoutData,
                    shippingAddress: { ...checkoutData.shippingAddress, address: e.target.value }
                  })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Thành phố</Label>
                  <Input
                    value={checkoutData.shippingAddress.city}
                    onChange={(e) => setCheckoutData({
                      ...checkoutData,
                      shippingAddress: { ...checkoutData.shippingAddress, city: e.target.value }
                    })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label>Quận/Huyện</Label>
                  <Input
                    value={checkoutData.shippingAddress.district}
                    onChange={(e) => setCheckoutData({
                      ...checkoutData,
                      shippingAddress: { ...checkoutData.shippingAddress, district: e.target.value }
                    })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <h3 className="font-semibold">Phương thức thanh toán</h3>
              <Select
                value={checkoutData.paymentMethod}
                onValueChange={(value) => setCheckoutData({
                  ...checkoutData,
                  paymentMethod: value
                })}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black text-white border-white/20">
                  <SelectItem value="cod">Thanh toán khi nhận hàng (COD)</SelectItem>
                  <SelectItem value="bank">Chuyển khoản ngân hàng</SelectItem>
                  <SelectItem value="momo">Ví MoMo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={processCheckout}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={!checkoutData.customerInfo.name || !checkoutData.customerInfo.phone || !checkoutData.shippingAddress.address}
            >
              Đặt hàng
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        .tech-grid {
          background-image: 
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: grid-move 20s linear infinite;
        }

        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        .hologram-container {
          position: relative;
          perspective: 1000px;
        }

        .hologram-device {
          position: relative;
          transform-style: preserve-3d;
          animation: float 6s ease-in-out infinite;
        }

        .hologram-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.1) 50%, transparent 70%);
          animation: scan 3s linear infinite;
          pointer-events: none;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotateY(0deg); }
          50% { transform: translateY(-20px) rotateY(5deg); }
        }

        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 1s ease-out;
        }
        
        /* Custom scrollbar styles */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
      `}</style>
    </div>
  )
}
