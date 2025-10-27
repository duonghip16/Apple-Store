"use client"

import React, { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  ShoppingCart,
  Eye,
  CreditCard,
  CheckCircle,
  Package,
  ArrowRight,
  ArrowDown,
  MousePointer,
  Sparkles,
  Brain,
  Zap,
  Network,
  ChevronRight,
  ChevronDown,
  Play,
  Pause,
  RotateCcw,
  Star,
  Heart,
  User,
  MapPin,
  Phone,
  Mail,
  Clock,
  Shield,
  Truck,
  Award,
  CheckSquare,
  AlertCircle,
  Info,
  Lightbulb,
  Target,
  Gift,
  Smartphone,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function GuidePage() {
  const [activeStep, setActiveStep] = useState(0)
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({})
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentDemo, setCurrentDemo] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const heroCanvasRef = useRef<HTMLCanvasElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Intersection Observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }))
        })
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    const elements = document.querySelectorAll('[data-animate]')
    elements.forEach(el => observerRef.current?.observe(el))

    return () => observerRef.current?.disconnect()
  }, [])

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
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        hue: Math.random() * 60 + 200, // Blue to purple range
      })
    }

    let animationId: number
    const animate = () => {
      if (!isPlaying) {
        animationId = requestAnimationFrame(animate)
        return
      }

      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, i) => {
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Mouse interaction
        const dx = mousePosition.x - particle.x
        const dy = mousePosition.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 150) {
          particle.vx += dx * 0.0001
          particle.vy += dy * 0.0001
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${particle.hue + Math.sin(Date.now() * 0.001 + i) * 30}, 70%, 60%, ${particle.opacity})`
        ctx.fill()

        // Draw connections
        particles.forEach((otherParticle, j) => {
          if (i !== j) {
            const dx = particle.x - otherParticle.x
            const dy = particle.y - otherParticle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 180) {
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              ctx.strokeStyle = `rgba(59, 130, 246, ${(1 - distance / 180) * 0.4})`
              ctx.lineWidth = 1
              ctx.stroke()
            }
          }
        })
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [mousePosition, isPlaying])

  // Auto-advance demo steps
  useEffect(() => {
    if (!isPlaying) return
    
    const interval = setInterval(() => {
      setCurrentDemo(prev => (prev + 1) % 6)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [isPlaying])

  // Animation styles
  const fadeInUp = (delay = 0) => ({
    transform: isVisible['hero'] ? 'translateY(0)' : 'translateY(50px)',
    opacity: isVisible['hero'] ? 1 : 0,
    transition: `all 0.8s ease-out ${delay}s`,
  })

  const slideInLeft = {
    transform: isVisible['steps'] ? 'translateX(0)' : 'translateX(-100px)',
    opacity: isVisible['steps'] ? 1 : 0,
    transition: 'all 0.8s ease-out',
  }

  const slideInRight = {
    transform: isVisible['steps'] ? 'translateX(0)' : 'translateX(100px)',
    opacity: isVisible['steps'] ? 1 : 0,
    transition: 'all 0.8s ease-out',
  }

  const scaleIn = (delay = 0) => ({
    transform: isVisible['demo'] ? 'scale(1)' : 'scale(0.8)',
    opacity: isVisible['demo'] ? 1 : 0,
    transition: `all 0.6s ease-out ${delay}s`,
  })

  const orderSteps = [
    {
      id: 1,
      title: "Tìm kiếm và chọn sản phẩm",
      description: "Sử dụng thanh tìm kiếm hoặc duyệt theo danh mục để tìm sản phẩm Apple mong muốn.",
      icon: Search,
      color: "from-blue-500 to-cyan-500",
      details: [
        "Sử dụng tìm kiếm thông minh hỗ trợ bởi AI",
        "Duyệt theo danh mục: iPhone, iPad, Mac, Apple Watch, AirPods",
        "Lọc theo giá, tính năng và tình trạng còn hàng",
        "Xem thông số kỹ thuật chi tiết của sản phẩm"
      ],
      demo: "Đang tìm kiếm iPhone 16 Pro Max...",
      tips: [
        "Sử dụng từ khóa cụ thể để có kết quả tốt hơn",
        "Kiểm tra đánh giá và xếp hạng sản phẩm",
        "So sánh các sản phẩm tương tự"
      ]
    },
    {
      id: 2,
      title: "Xem chi tiết sản phẩm",
      description: "Nhấp vào sản phẩm để xem hình ảnh, thông số kỹ thuật, giá cả và chính sách bảo hành.",
      icon: Eye,
      color: "from-purple-500 to-pink-500",
      details: [
        "Hình ảnh sản phẩm độ phân giải cao và góc nhìn 360°",
        "Thông số kỹ thuật đầy đủ",
        "Giá cả và tình trạng hàng theo thời gian thực",
        "Thông tin bảo hành và chi tiết phạm vi bảo hành"
      ],
      demo: "Đang xem chi tiết iPhone 16 Pro Max...",
      tips: [
        "Đọc đánh giá của khách hàng để biết trải nghiệm thực tế",
        "Kiểm tra điều khoản và điều kiện bảo hành",
        "Tìm kiếm các ưu đãi đặc biệt và gói sản phẩm"
      ]
    },
    {
      id: 3,
      title: "Thêm vào giỏ hàng",
      description: "Chọn số lượng, phiên bản và nhấp 'Thêm vào giỏ hàng'.",
      icon: ShoppingCart,
      color: "from-green-500 to-blue-500",
      details: [
        "Chọn dung lượng bộ nhớ và tùy chọn màu sắc",
        "Chọn số lượng cần thiết",
        "Thêm phụ kiện và gói bảo vệ",
        "Lưu sản phẩm vào danh sách yêu thích để mua sau"
      ],
      demo: "Đang thêm iPhone 16 Pro Max vào giỏ hàng...",
      tips: [
        "Cân nhắc mua phụ kiện cùng lúc",
        "Kiểm tra các khuyến mãi khi mua gói sản phẩm",
        "Xem lại giỏ hàng trước khi tiếp tục"
      ]
    },
    {
      id: 4,
      title: "Thanh toán",
      description: "Vào giỏ hàng của bạn, xem lại đơn hàng và nhấp 'Thanh toán'.",
      icon: CreditCard,
      color: "from-orange-500 to-red-500",
      details: [
        "Xem lại tất cả các mặt hàng trong giỏ hàng",
        "Áp dụng mã giảm giá hoặc phiếu ưu đãi",
        "Chọn phương thức và tốc độ vận chuyển",
        "Xác nhận tổng đơn hàng và thuế"
      ],
      demo: "Đang tiến hành thanh toán...",
      tips: [
        "Kiểm tra kỹ số lượng và mẫu mã sản phẩm",
        "Áp dụng mã giảm giá nếu có",
        "Chọn vận chuyển nhanh nhất nếu cần gấp"
      ]
    },
    {
      id: 5,
      title: "Điền thông tin và thanh toán",
      description: "Điền thông tin giao hàng và chọn phương thức thanh toán (COD, chuyển khoản ngân hàng, ví điện tử).",
      icon: User,
      color: "from-cyan-500 to-blue-500",
      details: [
        "Nhập địa chỉ giao hàng chính xác",
        "Cung cấp thông tin liên hệ",
        "Chọn phương thức thanh toán ưa thích",
        "Xem lại điều khoản và điều kiện"
      ],
      demo: "Đang điền thông tin giao hàng và thanh toán...",
      tips: [
        "Sử dụng địa chỉ chính xác để giao hàng thuận lợi",
        "Giữ số điện thoại liên lạc hoạt động để nhận cập nhật giao hàng",
        "Chọn phương thức thanh toán an toàn"
      ]
    },
    {
      id: 6,
      title: "Xác nhận và nhận đơn hàng",
      description: "Kiểm tra kỹ thông tin đơn hàng, xác nhận mua hàng và nhận đơn hàng với tùy chọn COD.",
      icon: Package,
      color: "from-indigo-500 to-purple-500",
      details: [
        "Xem xét và xác nhận đơn hàng cuối cùng",
        "Nhận xác nhận đơn hàng qua email/SMS",
        "Theo dõi đơn hàng theo thời gian thực",
        "Kiểm tra sản phẩm khi nhận hàng (COD)"
      ],
      demo: "Đơn hàng đã được xác nhận! Đang chuẩn bị giao hàng...",
      tips: [
        "Lưu xác nhận đơn hàng để tham khảo",
        "Theo dõi trạng thái giao hàng thường xuyên",
        "Kiểm tra sản phẩm trước khi thanh toán (COD)"
      ]
    }
  ]

  const paymentMethods = [
    {
      name: "Thanh toán khi nhận hàng (COD)",
      icon: Package,
      description: "Thanh toán khi nhận được đơn hàng",
      features: ["Không cần thanh toán trước", "Kiểm tra trước khi trả tiền", "Khả dụng toàn quốc"],
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "Chuyển khoản ngân hàng",
      icon: CreditCard,
      description: "Chuyển khoản trực tiếp",
      features: ["Giao dịch an toàn", "Xác nhận ngay lập tức", "Bảo mật cấp ngân hàng"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Ví điện tử",
      icon: Smartphone,
      description: "MoMo, ZaloPay, và hơn thế nữa",
      features: ["Thanh toán nhanh chóng", "Tiện lợi trên di động", "Xử lý tức thời"],
      color: "from-purple-500 to-pink-500"
    }
  ]

  const supportFeatures = [
    {
      icon: Shield,
      title: "Mua sắm an toàn",
      description: "Dữ liệu của bạn được bảo vệ với bảo mật cấp ngân hàng"
    },
    {
      icon: Truck,
      title: "Miễn phí vận chuyển",
      description: "Giao hàng miễn phí toàn quốc cho tất cả đơn hàng"
    },
    {
      icon: Award,
      title: "Sản phẩm chính hãng",
      description: "Sản phẩm Apple chính hãng 100% kèm bảo hành"
    },
    {
      icon: Brain,
      title: "Trợ lý AI",
      description: "Gợi ý thông minh và hỗ trợ tức thời"
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8); }
        }
        @keyframes slideInFromLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInFromRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        .tech-grid {
          background-image: 
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: tech-grid-move 20s linear infinite;
        }
        @keyframes tech-grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        .step-card {
          transition: all 0.3s ease;
        }
        .step-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
        }
        .demo-animation {
          animation: bounceIn 0.6s ease-out;
        }
        .floating-element {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20"></div>
        <div className="tech-grid absolute inset-0"></div>
      </div>

      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                <span className="text-white font-bold text-lg animate-pulse">🍎</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Hip Store
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white font-medium transition-all duration-300 hover:scale-105">
                Trang chủ
              </Link>
              <Link href="/supports/about" className="text-gray-300 hover:text-white font-medium transition-all duration-300 hover:scale-105">
                Giới thiệu
              </Link>
              <Link href="/supports/policy" className="text-gray-300 hover:text-white font-medium transition-all duration-300 hover:scale-105">
                Chính sách
              </Link>
              <Link href="/supports/faq" className="text-gray-300 hover:text-white font-medium transition-all duration-300 hover:scale-105">
                FAQ
              </Link>
              <Link href="/supports/guide" className="text-blue-400 font-medium">
                Hướng dẫn
              </Link>
            </nav>

            {/* Animation Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
                className="hover:bg-white/10"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentDemo(0)}
                className="hover:bg-white/10"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-16">
        {/* Hero Section */}
        <section id="hero" data-animate className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <canvas ref={heroCanvasRef} className="absolute inset-0 w-full h-full" />
          
          <div className="relative z-10 container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8" style={fadeInUp()}>
                <div className="space-y-6">
                  <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30 animate-pulse">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Hướng dẫn đặt hàng
                  </Badge>
                  
                  <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                      How to Order
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      at Hip Store
                    </span>
                  </h1>
                  
                  <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
                    Hãy làm theo hướng dẫn từng bước của chúng tôi để dễ dàng đặt hàng các sản phẩm Apple yêu thích của bạn với sự hỗ trợ của AI và các tùy chọn thanh toán an toàn.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    onClick={() => document.getElementById('steps')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Bắt đầu hướng dẫn
                  </Button>
                  <Link href="/">
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-black border-gray-800 hover:bg-gray-900 transform hover:scale-105 transition-all duration-300"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Mua ngay
                    </Button>
                  </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                  {[
                    { icon: CheckCircle, label: "Các bước dễ dàng", value: "6 bước" },
                    { icon: Shield, label: "Bảo mật", value: "100%" },
                    { icon: Truck, label: "Miễn phí giao hàng", value: "Toàn quốc" },
                    { icon: Clock, label: "Nhanh chóng", value: "1-3 Ngày" },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="text-center group cursor-pointer floating-element"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <stat.icon className="w-8 h-8 mx-auto mb-2 text-blue-400 group-hover:scale-125 transition-transform duration-300" />
                      <div className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative" style={fadeInUp(0.3)}>
                <div className="relative">
                  <div className="w-96 h-96 mx-auto bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                    <div className="w-80 h-80 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '20s' }}>
                      <div className="w-64 h-64 bg-gradient-to-r from-blue-700/40 to-purple-700/40 rounded-full flex items-center justify-center">
                        <Target className="w-32 h-32 text-blue-400 animate-pulse" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Guide Icons */}
                  <div className="absolute inset-0 pointer-events-none">
                    <Search className="absolute top-10 left-10 w-8 h-8 text-green-400 animate-bounce floating-element" style={{ animationDelay: '0s' }} />
                    <Eye className="absolute top-20 right-10 w-6 h-6 text-yellow-400 animate-pulse floating-element" style={{ animationDelay: '0.5s' }} />
                    <ShoppingCart className="absolute bottom-20 left-20 w-7 h-7 text-purple-400 animate-bounce floating-element" style={{ animationDelay: '1s' }} />
                    <CreditCard className="absolute bottom-10 right-20 w-8 h-8 text-cyan-400 floating-element" style={{ animationDelay: '1.5s' }} />
                    <Package className="absolute top-1/2 left-0 w-6 h-6 text-pink-400 animate-pulse floating-element" style={{ animationDelay: '2s' }} />
                    <CheckCircle className="absolute top-1/2 right-0 w-7 h-7 text-indigo-400 animate-bounce floating-element" style={{ animationDelay: '2.5s' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ArrowDown className="w-8 h-8 text-white/60" />
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section id="demo" data-animate className="relative z-10 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4" style={scaleIn()}>
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Demo mua sắm tương tác
                </span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto" style={scaleIn(0.2)}>
                Xem cách mua sắm dễ dàng tại Hip Store với bản demo tương tác của chúng tôi
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden" style={scaleIn(0.4)}>
                <CardHeader className="text-center py-8">
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <div className="flex space-x-2">
                      {orderSteps.map((_, index) => (
                        <div
                          key={index}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentDemo ? 'bg-blue-500 scale-125' : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Bước {currentDemo + 1}: {orderSteps[currentDemo].title}
                  </h3>
                  <p className="text-gray-300">
                    {orderSteps[currentDemo].demo}
                  </p>
                </CardHeader>
                
                <CardContent className="p-8">
                  <div className="demo-animation">
                    <div className="bg-gradient-to-r from-gray-900 to-black rounded-lg p-6 border border-white/20">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${orderSteps[currentDemo].color} flex items-center justify-center`}>
                          {React.createElement(orderSteps[currentDemo].icon, { className: "w-6 h-6 text-white" })}
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{orderSteps[currentDemo].title}</h4>
                          <p className="text-gray-400 text-sm">{orderSteps[currentDemo].description}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {orderSteps[currentDemo].details.map((detail, index) => (
                          <div key={index} className="flex items-center space-x-3 text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span className="text-sm">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center mt-6 space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentDemo(Math.max(0, currentDemo - 1))}
                      disabled={currentDemo === 0}
                      className="border-gray-400 hover:bg-gray-600"
                    >
                      Trước
                    </Button>
                    <Button
                      onClick={() => setCurrentDemo(Math.min(5, currentDemo + 1))}
                      disabled={currentDemo === 5}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Tiếp theo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Detailed Steps Section */}
        <section id="steps" data-animate className="relative z-10 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Hướng dẫn mua sắm đầy đủ
                </span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Làm theo các bước chi tiết này để hoàn tất đơn hàng của bạn thành công
              </p>
            </div>

            <div className="space-y-12">
              {orderSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                  }`}
                >
                  <div
                    className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}
                    style={index % 2 === 0 ? slideInLeft : slideInRight}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center`}>
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 mb-2">
                          Step {step.id}
                        </Badge>
                        <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {step.description}
                    </p>
                    
                    <div className="space-y-3">
                      {step.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300">{detail}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <h4 className="text-blue-300 font-semibold mb-2 flex items-center">
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Pro Tips
                      </h4>
                      <ul className="space-y-1">
                        {step.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="text-gray-300 text-sm flex items-start">
                            <span className="text-blue-400 mr-2">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div
                    className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}
                    style={index % 2 === 0 ? slideInRight : slideInLeft}
                  >
                    <Card className="step-card bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-500 overflow-hidden">
                      <CardContent className="p-8">
                        <div className="relative">
                          <div className="w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center border border-white/10">
                            <div className="text-center">
                              <step.icon className="w-16 h-16 mx-auto mb-4 text-blue-400 animate-pulse" />
                              <p className="text-gray-300 font-medium">{step.demo}</p>
                            </div>
                          </div>
                          
                          {/* Animated overlay */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Payment Methods Section */}
        <section className="relative z-10 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Phương thức thanh toán
                </span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Lựa chọn từ nhiều phương thức thanh toán an toàn và tiện lợi
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {paymentMethods.map((method, index) => (
                <Card
                  key={index}
                  className="group bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer"
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${method.color} flex items-center justify-center group-hover:rotate-12 transition-all duration-300`}
                    >
                      <method.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2 group-hover:text-blue-300 transition-colors">
                      {method.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                      {method.description}
                    </p>
                    <div className="space-y-2">
                      {method.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center justify-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Support Features Section */}
        <section className="relative z-10 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Tại sao chọn Hip Store?
                </span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Trải nghiệm tương lai của mua sắm với trợ lý AI và dịch vụ cao cấp
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportFeatures.map((feature, index) => (
                <Card
                  key={index}
                  className="group bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
                >
                  <CardContent className="p-6 text-center">
                    <feature.icon className="w-12 h-12 mx-auto mb-4 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-white font-semibold mb-2 group-hover:text-blue-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative z-10 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Câu hỏi thường gặp
                </span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Những câu hỏi phổ biến về đặt hàng tại Hip Store
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {[
                {
                  question: "Thời gian giao hàng mất bao lâu?",
                  answer: "Giao hàng mất 1-3 ngày làm việc đối với các thành phố lớn và 3-5 ngày đối với các khu vực khác. Tất cả đơn hàng đều được miễn phí vận chuyển toàn quốc."
                },
                {
                  question: "Tôi có thể kiểm tra sản phẩm trước khi thanh toán không?",
                  answer: "Có! Với tùy chọn COD (Thanh toán khi nhận hàng), bạn có thể kiểm tra sản phẩm trước khi thanh toán để đảm bảo nó đáp ứng mong đợi của bạn."
                },
                {
                  question: "Nếu tôi nhận được sản phẩm lỗi thì sao?",
                  answer: "Chúng tôi cung cấp chính sách đổi trả trong 7 ngày đối với sản phẩm lỗi. Hãy liên hệ ngay với đội ngũ hỗ trợ của chúng tôi để được trợ giúp."
                },
                {
                  question: "Tất cả sản phẩm có phải là sản phẩm Apple chính hãng không?",
                  answer: "Vâng, chúng tôi đảm bảo sản phẩm Apple chính hãng 100% với bảo hành chính thức và phụ kiện chính hãng."
                },
                {
                  question: "Làm thế nào để theo dõi đơn hàng của tôi?",
                  answer: "Bạn sẽ nhận được thông tin theo dõi qua SMS và email khi đơn hàng của bạn được gửi đi. Bạn cũng có thể kiểm tra trạng thái đơn hàng trong tài khoản của mình."
                }
              ].map((faq, index) => (
                <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white font-bold text-sm">Q</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-2">{faq.question}</h3>
                        <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 py-20">
          <div className="container mx-auto px-4">
            <Card className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm border-white/10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
              <CardContent className="relative z-10 p-12 text-center">
                <Gift className="w-16 h-16 mx-auto mb-6 text-blue-400 animate-pulse" />
                <h2 className="text-4xl font-bold mb-6 text-white">Sẵn sàng bắt đầu mua sắm?</h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Bây giờ bạn đã biết cách mua sắm dễ dàng tại Hip Store, hãy khám phá bộ sưu tập sản phẩm Apple cao cấp của chúng tôi với sự hỗ trợ của AI.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Bắt đầu mua sắm ngay
                    </Button>
                  </Link>
                  <Link href="/supports/about">
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-black text-white border-gray-400 hover:bg-gray-500 transform hover:scale-105 transition-all duration-300"
                    >
                      <Info className="w-4 h-4 mr-2" />
                      Tìm hiểu thêm về chúng tôi
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

         {/* Footer */}
        <footer className="relative z-10 bg-black/80 backdrop-blur-sm border-t border-white/10 py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">🍎</span>
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Hip Store
                  </span>
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Cửa hàng Apple uy tín với công nghệ AI tiên tiến, mang đến trải nghiệm mua sắm thông minh nhất.
                </p>
                <div className="flex space-x-4">
                  {["📘", "📷", "🐦", "📺"].map((emoji, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="icon"
                      className="hover:bg-white/10 transition-all hover:scale-110"
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mx-auto">
                <h3 className="font-semibold mb-4 text-white ">Liên kết nhanh</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block">
                      Trang chủ
                    </Link>
                  </li>
                  <li>
                    <Link href="/supports/about" className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block">
                      Giới thiệu
                    </Link>
                  </li>
                  <li>
                    <Link href="/supports/policy" className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block">
                      Chính sách
                    </Link>
                  </li>
                  <li>
                    <Link href="/supports/faq" className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="/supports/guide" className="text-blue-400 font-medium">
                      Hướng dẫn
                    </Link>
                  </li>
                </ul>
              </div>


              <div>
                <h3 className="font-semibold mb-4 text-white">Thông tin liên hệ</h3>
                <ul className="space-y-2">
                  <span className="font-semibold mr-2">📍</span>
                  <a
                    href="https://www.google.com/maps/place/Bitexco+Financial+Tower/@10.7776312,106.7109444,11z/data=!4m6!3m5!1s0x31752f3acf87eaeb:0xc969a1975f3be32a!8m2!3d10.7717064!4d106.7043759!16s%2Fm%2F026685n?entry=ttu&g_ep=EgoyMDI1MDcxNi4wIKXMDSoASAFQAw%3D%3D"
                    className="text-gray-400"
                  >Bitexco Financial Tower, 2 Hai Trieu, Ben Nghe Ward, District 1, HCM City
                  </a>
                  <li>
                    <a href="tel:+84346938659" className="text-gray-400 hover:text-white transition-colors">
                      📞 +84 346 938 659
                    </a>
                  </li>
                  <li>
                    <a href="mailto:duonghip1609@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                      ✉️ duonghip1609@gmail.com
                    </a>
                  </li>
                  <li>
                    <span className="text-gray-400">🕒 8:00 - 22:00 hàng ngày</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/10 mt-12 pt-8 text-center">
              <p className="text-gray-400">
                © 2025 Hip Store. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
