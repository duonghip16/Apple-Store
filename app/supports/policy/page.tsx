"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  RefreshCw,
  CreditCard,
  Truck,
  Lock,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Clock,
  Globe,
  Star,
  Heart,
  Zap,
  Eye,
  Brain,
  Cpu,
  Network,
  Atom,
  Waves,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Award,
  Users,
  FileText,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Timer,
  Banknote,
  Package,
  UserCheck,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function PolicyPage() {
  const [activePolicy, setActivePolicy] = useState(0)
  const [expandedSections, setExpandedSections] = useState<{ [key: number]: boolean }>({})
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({})
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [readingProgress, setReadingProgress] = useState<{ [key: number]: number }>({})
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const heroCanvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<any[]>([])
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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
          
          // Update reading progress
          if (entry.isIntersecting && (entry.target as HTMLElement).dataset.policyIndex) {
            const index = parseInt((entry.target as HTMLElement).dataset.policyIndex!)
            setReadingProgress(prev => ({
              ...prev,
              [index]: Math.min((prev[index] || 0) + 10, 100)
            }))
          }
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
        hue: Math.random() * 60 + 200,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulse: 0,
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
        particle.pulse += particle.pulseSpeed

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
          particle.size = Math.min(particle.size * 1.01, 6)
        } else {
          particle.size = Math.max(particle.size * 0.99, 1)
        }

        // Draw particle with pulsing effect
        const pulseSize = particle.size + Math.sin(particle.pulse) * 0.5
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2)
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

  // Policy data with enhanced content
  const policies = [
    {
      id: 0,
      icon: RefreshCw,
      title: "Return & Exchange Policy",
      subtitle: "Chính sách Đổi trả",
      color: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10",
      content: [
        {
          title: "Thời gian đổi trả",
          description: "Customers can return or exchange products within 7 days of receiving if the item is faulty or not as described.",
          details: "Khách hàng có thể đổi trả sản phẩm trong vòng 7 ngày kể từ khi nhận hàng nếu sản phẩm bị lỗi hoặc không đúng mô tả.",
          icon: Clock,
          stats: "7 ngày"
        },
        {
          title: "Điều kiện sản phẩm",
          description: "The product must be unused, with original packaging, labels, and accessories intact.",
          details: "Sản phẩm phải chưa sử dụng, còn nguyên bao bì, nhãn mác và phụ kiện đầy đủ.",
          icon: Package,
          stats: "100% nguyên vẹn"
        },
        {
          title: "Quy trình đổi trả",
          description: "Simple and fast return process with free pickup service for defective products.",
          details: "Quy trình đổi trả đơn giản, nhanh chóng với dịch vụ thu hồi miễn phí cho sản phẩm lỗi.",
          icon: RotateCcw,
          stats: "Miễn phí"
        }
      ]
    },
    {
      id: 1,
      icon: Shield,
      title: "Warranty Policy",
      subtitle: "Chính sách Bảo hành",
      color: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      content: [
        {
          title: "Bảo hành chính hãng",
          description: "All Apple products are covered by Apple's official global warranty policy.",
          details: "Tất cả sản phẩm Apple đều được bảo hành theo chính sách bảo hành toàn cầu chính thức của Apple.",
          icon: Award,
          stats: "Toàn cầu"
        },
        {
          title: "Hỗ trợ bảo hành",
          description: "Hip Store supports customers with free warranty processing during the warranty period.",
          details: "Hip Store hỗ trợ khách hàng xử lý bảo hành miễn phí trong thời gian bảo hành.",
          icon: Users,
          stats: "Miễn phí"
        },
        {
          title: "Thời gian bảo hành",
          description: "Standard 12-month warranty with extended warranty options available.",
          details: "Bảo hành tiêu chuẩn 12 tháng với tùy chọn gia hạn bảo hành có sẵn.",
          icon: Calendar,
          stats: "12 tháng"
        }
      ]
    },
    {
      id: 2,
      icon: CreditCard,
      title: "Payment Policy",
      subtitle: "Chính sách Thanh toán",
      color: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      content: [
        {
          title: "Phương thức thanh toán",
          description: "Accepts various payment methods: Cash on Delivery (COD), bank transfer, and e-wallet payment.",
          details: "Chấp nhận nhiều phương thức thanh toán: Thanh toán khi nhận hàng (COD), chuyển khoản ngân hàng và thanh toán ví điện tử.",
          icon: Banknote,
          stats: "Đa dạng"
        },
        {
          title: "Bảo mật thông tin",
          description: "Customer payment information is kept absolutely confidential.",
          details: "Thông tin thanh toán của khách hàng được bảo mật tuyệt đối.",
          icon: Lock,
          stats: "100% bảo mật"
        },
        {
          title: "Xử lý thanh toán",
          description: "Fast and secure payment processing with instant confirmation.",
          details: "Xử lý thanh toán nhanh chóng và an toàn với xác nhận tức thì.",
          icon: Zap,
          stats: "Tức thì"
        }
      ]
    },
    {
      id: 3,
      icon: Truck,
      title: "Shipping Policy",
      subtitle: "Chính sách Vận chuyển",
      color: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/10 to-red-500/10",
      content: [
        {
          title: "Miễn phí vận chuyển",
          description: "Free nationwide shipping for all orders.",
          details: "Miễn phí vận chuyển toàn quốc cho tất cả đơn hàng.",
          icon: Globe,
          stats: "Toàn quốc"
        },
        {
          title: "Thời gian giao hàng",
          description: "Delivery time: 1–3 working days for major cities, 3–5 days for other areas.",
          details: "Thời gian giao hàng: 1-3 ngày làm việc cho các thành phố lớn, 3-5 ngày cho các khu vực khác.",
          icon: Timer,
          stats: "1-5 ngày"
        },
        {
          title: "Theo dõi đơn hàng",
          description: "Real-time order tracking with SMS and email notifications.",
          details: "Theo dõi đơn hàng thời gian thực với thông báo SMS và email.",
          icon: Eye,
          stats: "Thời gian thực"
        }
      ]
    },
    {
      id: 4,
      icon: Lock,
      title: "Privacy Policy",
      subtitle: "Chính sách Bảo mật",
      color: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-500/10 to-purple-500/10",
      content: [
        {
          title: "Bảo mật thông tin",
          description: "All customer personal information is kept strictly confidential and not shared with third parties.",
          details: "Tất cả thông tin cá nhân của khách hàng được bảo mật nghiêm ngặt và không chia sẻ với bên thứ ba.",
          icon: UserCheck,
          stats: "Nghiêm ngặt"
        },
        {
          title: "Mã hóa dữ liệu",
          description: "Customer data is encrypted and stored securely.",
          details: "Dữ liệu khách hàng được mã hóa và lưu trữ an toàn.",
          icon: Network,
          stats: "Mã hóa"
        },
        {
          title: "Tuân thủ quy định",
          description: "Full compliance with data protection regulations and international standards.",
          details: "Tuân thủ đầy đủ các quy định bảo vệ dữ liệu và tiêu chuẩn quốc tế.",
          icon: FileText,
          stats: "Quốc tế"
        }
      ]
    }
  ]

  const toggleSection = (index: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const fadeInUp = (delay = 0) => ({
    transform: isVisible['policies'] ? 'translateY(0)' : 'translateY(50px)',
    opacity: isVisible['policies'] ? 1 : 0,
    transition: `all 0.8s ease-out ${delay}s`,
  })

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

  const scaleIn = (delay = 0) => ({
    transform: isVisible['contact'] ? 'scale(1)' : 'scale(0.8)',
    opacity: isVisible['contact'] ? 1 : 0,
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
          50% { opacity: 0.7; }
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
        .floating-icon {
          animation: float 6s ease-in-out infinite;
        }
        .pulse-icon {
          animation: pulse 2s ease-in-out infinite;
        }
        .bounce-icon {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>

      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20"></div>
        <div className="tech-grid absolute inset-0"></div>
      </div>

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Progress value={scrollProgress} className="h-1 bg-transparent" />
      </div>

      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10 mt-1">
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
              <Link href="/supports/policy" className="text-blue-400 font-medium">
                Chính sách
              </Link>
              <Link href="/supports/faq" className="text-gray-300 hover:text-white font-medium transition-all duration-300 hover:scale-105">
                FAQ
              </Link>
              <Link href="/supports/guide" className="text-gray-300 hover:text-white font-medium transition-all duration-300 hover:scale-105">
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
                onClick={() => setIsMuted(!isMuted)}
                className="hover:bg-white/10"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-17">
        {/* Hero Section */}
        <section id="hero" data-animate className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <canvas ref={heroCanvasRef} className="absolute inset-0 w-full h-full" />
          
          <div className="relative z-10 container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8" style={slideInLeft}>
                <div className="space-y-6">
                  <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30 animate-pulse">
                    <FileText className="w-4 h-4 mr-2" />
                    Hip Store Policy
                  </Badge>
                  
                  <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                      Policy 
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Hip Store
                    </span>
                  </h1>
                  
                  <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
                    Tìm hiểu về các chính sách bảo hành, đổi trả, thanh toán, vận chuyển và bảo mật của Hip Store. 
                    Chúng tôi cam kết mang đến trải nghiệm mua sắm an toàn và tin cậy nhất.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    onClick={() => document.getElementById('policies')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Xem chính sách
                  </Button>
                  <Link href="/">
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-black border-gray-800 hover:bg-gray-700 hover:text-white transform hover:scale-105 transition-all duration-300"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Về trang chủ
                    </Button>
                  </Link>
                </div>

                {/* Policy Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8">
                  {[
                    { icon: Shield, label: "Bảo hành", value: "12 tháng", color: "text-green-400" },
                    { icon: RefreshCw, label: "Đổi trả", value: "7 ngày", color: "text-blue-400" },
                    { icon: Truck, label: "Giao hàng", value: "Miễn phí", color: "text-purple-400" },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="text-center group cursor-pointer floating-icon"
                      style={{ animationDelay: `${index * 0.5}s` }}
                    >
                      <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color} group-hover:scale-125 transition-transform duration-300`} />
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
                  <div className="w-96 h-96 mx-auto bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                    <div className="w-80 h-80 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '20s' }}>
                      <div className="w-64 h-64 bg-gradient-to-r from-blue-700/40 to-purple-700/40 rounded-full flex items-center justify-center">
                        <FileText className="w-32 h-32 text-blue-400 pulse-icon" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Policy Icons */}
                  <div className="absolute inset-0 pointer-events-none">
                    <Shield className="absolute top-10 left-10 w-8 h-8 text-green-400 bounce-icon" style={{ animationDelay: '0s' }} />
                    <RefreshCw className="absolute top-20 right-10 w-6 h-6 text-blue-400 floating-icon" style={{ animationDelay: '0.5s' }} />
                    <CreditCard className="absolute bottom-20 left-20 w-7 h-7 text-purple-400 bounce-icon" style={{ animationDelay: '1s' }} />
                    <Truck className="absolute bottom-10 right-20 w-8 h-8 text-orange-400 floating-icon" style={{ animationDelay: '1.5s' }} />
                    <Lock className="absolute top-1/2 left-0 w-6 h-6 text-indigo-400 pulse-icon" style={{ animationDelay: '2s' }} />
                    <CheckCircle className="absolute top-1/2 right-0 w-7 h-7 text-green-400 bounce-icon" style={{ animationDelay: '2.5s' }} />
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

        {/* Policies Section */}
        <section id="policies" data-animate className="relative z-10 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4" style={fadeInUp()}>
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Chính sách Hip Store
                </span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto" style={fadeInUp(0.2)}>
                Khám phá các chính sách chi tiết của chúng tôi để hiểu rõ quyền lợi và trách nhiệm khi mua sắm tại Hip Store
              </p>
            </div>

            {/* Policy Navigation */}
            <div className="flex flex-wrap justify-center gap-4 mb-12" style={fadeInUp(0.4)}>
              {policies.map((policy, index) => (
                <Button
                  key={index}
                  variant={activePolicy === index ? "default" : "outline"}
                  onClick={() => setActivePolicy(index)}
                  className={`${
                    activePolicy === index
                      ? `bg-gradient-to-r ${policy.color} text-white`
                      : "bg-black border-gray-800 hover:bg-gray-700 hover:text-white"
                  } transform hover:scale-105 transition-all duration-300`}
                >
                  <policy.icon className="w-4 h-4 mr-2" />
                  {policy.subtitle}
                </Button>
              ))}
            </div>

            {/* Active Policy Content */}
            <div className="space-y-8">
              {policies.map((policy, policyIndex) => (
                <Card
                  key={policyIndex}
                  className={`${
                    activePolicy === policyIndex ? 'block' : 'hidden'
                  } bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden hologram-effect`}
                  style={fadeInUp(0.6)}
                  data-policy-index={policyIndex}
                >
                  <CardHeader className={`bg-gradient-to-r ${policy.bgGradient} border-b border-white/10`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${policy.color} flex items-center justify-center floating-icon`}>
                          <policy.icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{policy.title}</h3>
                          <p className="text-gray-300">{policy.subtitle}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400 mb-2">Tiến độ đọc</div>
                        <Progress value={readingProgress[policyIndex] || 0} className="w-32" />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-8">
                    <div className="space-y-6">
                      {policy.content.map((item, itemIndex) => (
                        <Card
                          key={itemIndex}
                          className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 cursor-pointer"
                          onClick={() => toggleSection(policyIndex * 10 + itemIndex)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${policy.color} flex items-center justify-center pulse-icon`}>
                                  <item.icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                                  <Badge className={`bg-gradient-to-r ${policy.color} text-white mt-1`}>
                                    {item.stats}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-blue-400 border-blue-400">
                                  Chi tiết
                                </Badge>
                                {expandedSections[policyIndex * 10 + itemIndex] ? (
                                  <ChevronUp className="w-5 h-5 text-gray-400" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                            </div>

                            <p className="text-gray-300 mb-4 leading-relaxed">
                              {item.description}
                            </p>

                            {expandedSections[policyIndex * 10 + itemIndex] && (
                              <div className="mt-4 p-4 bg-white/5 rounded-lg border-l-4 border-blue-500 animate-fade-in">
                                <p className="text-gray-300 leading-relaxed">
                                  {item.details}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Policy Summary */}
            <Card className="mt-12 bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm border-white/10 overflow-hidden" style={fadeInUp(0.8)}>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
              <CardContent className="relative z-10 p-8 text-center">
                <Brain className="w-16 h-16 mx-auto mb-6 text-blue-400 pulse-icon" />
                <h3 className="text-2xl font-bold mb-4 text-white">Cam kết của Hip Store</h3>
                <p className="text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
                  Chúng tôi cam kết mang đến trải nghiệm mua sắm Apple tốt nhất với các chính sách minh bạch, 
                  dịch vụ chuyên nghiệp và công nghệ AI tiên tiến để phục vụ khách hàng.
                </p>
                
                <div className="grid md:grid-cols-4 gap-6 mt-8">
                  {[
                    { icon: CheckCircle, title: "Minh bạch", desc: "Chính sách rõ ràng" },
                    { icon: Shield, title: "Bảo mật", desc: "Thông tin an toàn" },
                    { icon: Heart, title: "Tận tâm", desc: "Phục vụ chu đáo" },
                    { icon: Star, title: "Chất lượng", desc: "Sản phẩm chính hãng" }
                  ].map((item, index) => (
                    <div key={index} className="group cursor-pointer floating-icon" style={{ animationDelay: `${index * 0.2}s` }}>
                      <item.icon className="w-12 h-12 mx-auto mb-3 text-blue-400 group-hover:scale-125 transition-transform duration-300" />
                      <h4 className="text-white font-semibold mb-1 group-hover:text-blue-300 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" data-animate className="relative z-10 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4" style={scaleIn()}>
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Cần hỗ trợ thêm?
                </span>
              </h2>
              <p className="text-gray-400" style={scaleIn(0.2)}>
                Liên hệ với chúng tôi để được tư vấn chi tiết về các chính sách
              </p>
            </div>

            
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
                    <Link href="/supports/policy" className="text-blue-400 font-medium">
                      Chính sách
                    </Link>
                  </li>
                  <li>
                    <Link href="/supports/faq" className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block">
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
