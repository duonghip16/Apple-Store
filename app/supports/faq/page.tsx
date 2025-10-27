"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChevronDown,
  ChevronUp,
  Search,
  HelpCircle,
  Shield,
  Truck,
  CreditCard,
  RefreshCw,
  CheckCircle,
  Lock,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Brain,
  Zap,
  Eye,
  Network,
  ArrowRight,
  Home,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"

export default function FAQPage() {
  const [expandedItems, setExpandedItems] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredFAQs, setFilteredFAQs] = useState<any[]>([])
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({})
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [activeCategory, setActiveCategory] = useState("all")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const heroCanvasRef = useRef<HTMLCanvasElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // FAQ Data
  const faqData = [
    {
      id: 1,
      category: "product",
      icon: Shield,
      question: "Có phải tất cả sản phẩm Apple tại Hip Store đều là hàng chính hãng không?",
      answer: "Phải. Tất cả sản phẩm Apple được bán tại Hip Store đều là hàng chính hãng 100%, được niêm phong tại nhà máy, có nguồn gốc rõ ràng và được bảo hành toàn cầu bởi Apple.",
      color: "from-green-500 to-emerald-500",
      tags: ["genuine", "warranty", "authentic"]
    },
    {
      id: 2,
      category: "warranty",
      icon: CheckCircle,
      question: "Tôi có thể kiểm tra chế độ bảo hành của sản phẩm như thế nào?",
      answer: "Bạn có thể kiểm tra chế độ bảo hành trực tiếp trên trang web chính thức của Apple hoặc liên hệ với nhóm Hip Store để được hỗ trợ nhanh chóng.",
      color: "from-blue-500 to-cyan-500",
      tags: ["warranty", "check", "support"]
    },
    {
      id: 3,
      category: "shipping",
      icon: Truck,
      question: "Hip Store có giao hàng trên toàn quốc không?",
      answer: "Có. Chúng tôi miễn phí vận chuyển trên toàn quốc cho mọi đơn hàng.",
      color: "from-purple-500 to-pink-500",
      tags: ["shipping", "delivery", "nationwide"]
    },
    {
      id: 4,
      category: "payment",
      icon: CreditCard,
      question: "Tôi có thể kiểm tra sản phẩm trước khi thanh toán không?",
      answer: "Có, bạn có thể kiểm tra đơn hàng trước khi thanh toán nếu bạn chọn Thanh toán khi nhận hàng (COD).",
      color: "from-orange-500 to-red-500",
      tags: ["payment", "cod", "check"]
    },
    {
      id: 5,
      category: "return",
      icon: RefreshCw,
      question: "Nếu sản phẩm của tôi bị lỗi hoặc không như mô tả thì sao?",
      answer: "Bạn có thể đổi hoặc trả lại sản phẩm trong vòng 7 ngày kể từ ngày nhận nếu sản phẩm bị lỗi hoặc không như mô tả.",
      color: "from-cyan-500 to-blue-500",
      tags: ["return", "exchange", "faulty"]
    },
    {
      id: 6,
      category: "payment",
      icon: CreditCard,
      question: "Có những phương thức thanh toán nào?",
      answer: "Chúng tôi chấp nhận thanh toán bằng tiền mặt khi nhận hàng (COD), chuyển khoản ngân hàng và ví điện tử.",
      color: "from-indigo-500 to-purple-500",
      tags: ["payment", "methods", "cod", "bank"]
    },
    {
      id: 7,
      category: "privacy",
      icon: Lock,
      question: "Hip Store bảo vệ thông tin cá nhân của tôi như thế nào?",
      answer: "Mọi thông tin của khách hàng đều được bảo mật nghiêm ngặt, không chia sẻ với bên thứ ba và được lưu trữ an toàn.",
      color: "from-pink-500 to-rose-500",
      tags: ["privacy", "security", "confidential"]
    }
  ]

  const categories = [
    { id: "all", name: "Tất cả", icon: HelpCircle, count: faqData.length },
    { id: "product", name: "Sản phẩm", icon: Shield, count: faqData.filter(f => f.category === "product").length },
    { id: "warranty", name: "Bảo hành", icon: CheckCircle, count: faqData.filter(f => f.category === "warranty").length },
    { id: "shipping", name: "Vận chuyển", icon: Truck, count: faqData.filter(f => f.category === "shipping").length },
    { id: "payment", name: "Thanh toán", icon: CreditCard, count: faqData.filter(f => f.category === "payment").length },
    { id: "return", name: "Đổi trả", icon: RefreshCw, count: faqData.filter(f => f.category === "return").length },
    { id: "privacy", name: "Bảo mật", icon: Lock, count: faqData.filter(f => f.category === "privacy").length }
  ]

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
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
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

      ctx.fillStyle = "rgba(0, 0, 0, 0.03)"
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
          particle.vx += dx * 0.00005
          particle.vy += dy * 0.00005
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

            if (distance < 120) {
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              ctx.strokeStyle = `rgba(59, 130, 246, ${(1 - distance / 120) * 0.3})`
              ctx.lineWidth = 0.8
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

  // Filter FAQs based on search and category
  useEffect(() => {
    let filtered = faqData

    if (activeCategory !== "all") {
      filtered = filtered.filter(faq => faq.category === activeCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    setFilteredFAQs(filtered)
  }, [searchQuery, activeCategory])

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const expandAll = () => {
    setExpandedItems(filteredFAQs.map(faq => faq.id))
  }

  const collapseAll = () => {
    setExpandedItems([])
  }

  // Animation styles
  const slideInLeft = {
    transform: isVisible['hero'] ? 'translateX(0)' : 'translateX(-100px)',
    opacity: isVisible['hero'] ? 1 : 0,
    transition: 'all 0.8s ease-out',
  }

  const slideInRight = {
    transform: isVisible['hero'] ? 'translateX(0)' : 'translateX(100px)',
    opacity: isVisible['hero'] ? 1 : 0,
    transition: 'all 0.8s ease-out',
  }

  const fadeInUp = (delay = 0) => ({
    transform: isVisible['faq-content'] ? 'translateY(0)' : 'translateY(50px)',
    opacity: isVisible['faq-content'] ? 1 : 0,
    transition: `all 0.8s ease-out ${delay}s`,
  })

  const scaleIn = (delay = 0) => ({
    transform: isVisible['categories'] ? 'scale(1)' : 'scale(0.8)',
    opacity: isVisible['categories'] ? 1 : 0,
    transition: `all 0.6s ease-out ${delay}s`,
  })

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
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
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
        .hologram-effect {
          position: relative;
          overflow: hidden;
        }
        .hologram-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          animation: hologram-scan 3s infinite;
        }
        @keyframes hologram-scan {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
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
              <Link href="/" className="text-gray-300 hover:text-white font-medium transition-all duration-300 hover:scale-105 relative group">
                Trang chủ
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/supports/about" className="text-gray-300 hover:text-white font-medium transition-all duration-300 hover:scale-105 relative group">
                Giới thiệu
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/supports/policy" className="text-gray-300 hover:text-white font-medium transition-all duration-300 hover:scale-105 relative group">
                Chính sách
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/supports/faq" className="text-blue-400 font-medium">
                FAQ
              </Link>
              <Link href="/supports/guide" className="text-gray-300 hover:text-white font-medium transition-all duration-300 hover:scale-105 relative group">
                Hướng dẫn
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
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
                onClick={() => setIsMuted(!isMuted)}
                className="hover:bg-white/10"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
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
              <div className="space-y-8" style={slideInLeft}>
                <div className="space-y-6">
                  <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30 animate-pulse">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    FAQ - Hip Store
                  </Badge>
                  
                  <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                      Frequently
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Asked Questions
                    </span>
                  </h1>
                  
                  <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
                    Tìm câu trả lời nhanh chóng cho các câu hỏi thường gặp về sản phẩm Apple, dịch vụ và chính sách của Hip Store.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    onClick={() => document.getElementById('faq-content')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Xem câu hỏi
                  </Button>
                  <Link href="/">
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-black border-gray-800 hover:bg-gray-700 hover:text-white transform hover:scale-105 transition-all duration-300"
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Về trang chủ
                    </Button>
                  </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8">
                  {[
                    { icon: HelpCircle, label: "Câu hỏi", value: faqData.length.toString() },
                    { icon: MessageCircle, label: "Danh mục", value: (categories.length - 1).toString() },
                    { icon: Zap, label: "Hỗ trợ 24/7", value: "Luôn sẵn sàng" },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="text-center group cursor-pointer animate-float"
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

              <div className="relative" style={slideInRight}>
                <div className="hologram-effect relative">
                  <div className="w-96 h-96 mx-auto bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10 animate-bounce-slow">
                    <div className="w-80 h-80 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '20s' }}>
                      <div className="w-64 h-64 bg-gradient-to-r from-blue-700/40 to-purple-700/40 rounded-full flex items-center justify-center">
                        <HelpCircle className="w-32 h-32 text-blue-400 animate-pulse" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating FAQ Icons */}
                  <div className="absolute inset-0 pointer-events-none">
                    <Shield className="absolute top-10 left-10 w-8 h-8 text-green-400 animate-bounce" style={{ animationDelay: '0s' }} />
                    <Truck className="absolute top-20 right-10 w-6 h-6 text-purple-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
                    <CreditCard className="absolute bottom-20 left-20 w-7 h-7 text-orange-400 animate-bounce" style={{ animationDelay: '1s' }} />
                    <Lock className="absolute bottom-10 right-20 w-8 h-8 text-pink-400 animate-spin" style={{ animationDuration: '3s' }} />
                    <CheckCircle className="absolute top-1/2 left-0 w-6 h-6 text-cyan-400 animate-pulse" style={{ animationDelay: '1.5s' }} />
                    <RefreshCw className="absolute top-1/2 right-0 w-7 h-7 text-indigo-400 animate-bounce" style={{ animationDelay: '2s' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-white/60" />
          </div>
        </section>

        {/* Search and Categories Section */}
        <section id="categories" data-animate className="relative z-10 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4" style={fadeInUp()}>
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Tìm kiếm câu trả lời
                </span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto mb-8" style={fadeInUp(0.2)}>
                Sử dụng tìm kiếm hoặc chọn danh mục để tìm câu trả lời nhanh chóng
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto mb-8" style={fadeInUp(0.4)}>
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Tìm kiếm câu hỏi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg bg-white/10 border-white/20 text-white placeholder-gray-400 focus:bg-white/20 transition-all rounded-2xl"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    ✕
                  </Button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 mb-8" style={fadeInUp(0.6)}>
                <Button
                  onClick={expandAll}
                  variant="outline"
                  className="bg-black border-gray-800 hover:bg-gray-700 hover:text-white"
                >
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Mở tất cả
                </Button>
                <Button
                  onClick={collapseAll}
                  variant="outline"
                  className="bg-black border-gray-800 hover:bg-gray-700 hover:text-white"
                >
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Đóng tất cả
                </Button>
              </div>
            </div>

            {/* Category Filters */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-12">
              {categories.map((category, index) => (
                <Card
                  key={category.id}
                  className={`group cursor-pointer transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${
                    activeCategory === category.id 
                      ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/50" 
                      : "bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10"
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                  style={scaleIn(index * 0.1)}
                >
                  <CardContent className="p-4 text-center">
                    <category.icon className={`w-8 h-8 mx-auto mb-2 transition-all duration-300 ${
                      activeCategory === category.id ? "text-blue-400 scale-110" : "text-gray-400 group-hover:text-blue-400"
                    }`} />
                    <h3 className={`font-medium text-sm transition-colors ${
                      activeCategory === category.id ? "text-blue-300" : "text-white group-hover:text-blue-300"
                    }`}>
                      {category.name}
                    </h3>
                    <Badge className={`mt-1 text-xs ${
                      activeCategory === category.id 
                        ? "bg-blue-500/20 text-blue-300" 
                        : "bg-gray-500/20 text-gray-400"
                    }`}>
                      {category.count}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section id="faq-content" data-animate className="relative z-10 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {filteredFAQs.length === 0 ? (
                <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-12 text-center">
                  <HelpCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2 text-white">Không tìm thấy câu hỏi</h3>
                  <p className="text-gray-400 mb-6">Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác</p>
                  <Button
                    onClick={() => {
                      setSearchQuery("")
                      setActiveCategory("all")
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Xem tất cả câu hỏi
                  </Button>
                </Card>
              ) : (
                <div className="space-y-6">
                  {filteredFAQs.map((faq, index) => (
                    <Card
                      key={faq.id}
                      className="group bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:scale-[1.02] overflow-hidden hologram-effect"
                      style={fadeInUp(index * 0.1)}
                    >
                      <CardContent className="p-0">
                        <button
                          onClick={() => toggleExpanded(faq.id)}
                          className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${faq.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                              <faq.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                                {faq.question}
                              </h3>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {faq.tags.map((tag: string, tagIndex: number) => (
                                  <Badge
                                    key={tagIndex}
                                    className="bg-gray-500/20 text-gray-400 text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={`bg-gradient-to-r ${faq.color} text-white`}>
                              {categories.find(c => c.id === faq.category)?.name}
                            </Badge>
                            {expandedItems.includes(faq.id) ? (
                              <ChevronUp className="w-5 h-5 text-blue-400 transform group-hover:scale-110 transition-transform" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400 transform group-hover:scale-110 transition-transform" />
                            )}
                          </div>
                        </button>

                        {expandedItems.includes(faq.id) && (
                          <div className="px-6 pb-6 border-t border-white/10">
                            <div className="pt-4 pl-16">
                              <p className="text-gray-300 leading-relaxed text-lg">
                                {faq.answer}
                              </p>
                              <div className="mt-4 flex items-center space-x-4">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => document.getElementById('contact-support')?.scrollIntoView({ behavior: 'smooth' })}
                                  className="border-gray-800 hover:bg-blue-500">
                                  <MessageCircle className="w-4 h-4 mr-2" />
                                  Hỗ trợ thêm
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Contact Support Section */}
        <section id="contact-support" className="relative z-10 py-20">
          <div className="container mx-auto px-4">
            <Card className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm border-white/10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
              <CardContent className="relative z-10 p-12 text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-6 text-blue-400 animate-pulse" />
                <h2 className="text-4xl font-bold mb-6 text-white">Cần hỗ trợ thêm?</h2>
                <p className="text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Không tìm thấy câu trả lời? 
                  Liên hệ với đội ngũ hỗ trợ Hip Store để được tư vấn chi tiết
                </p>
                
                

                <div className="mt-12">
                  <Link href="/">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Về trang chủ
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
                    <Link href="/supports/faq" className="text-blue-400 font-medium">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="/supports/guide" className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block">
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
