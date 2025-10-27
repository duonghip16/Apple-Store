"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Cpu,
  Zap,
  Eye,
  Sparkles,
  Waves,
  Atom,
  Network,
  Shield,
  Truck,
  Award,
  Star,
  Heart,
  CheckCircle,
  ArrowRight,
  Globe,
  Users,
  Target,
  Lightbulb,
  Rocket,
  ChevronDown,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState(0)
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({})
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
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
    for (let i = 0; i < 100; i++) {
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
        
        if (distance < 100) {
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

            if (distance < 150) {
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              ctx.strokeStyle = `rgba(59, 130, 246, ${(1 - distance / 150) * 0.4})`
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

  // Floating animation for elements
  const floatingAnimation = {
    animation: 'float 6s ease-in-out infinite',
  }

  const pulseAnimation = {
    animation: 'pulse 2s ease-in-out infinite',
  }

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
    transform: isVisible['features'] ? 'translateY(0)' : 'translateY(50px)',
    opacity: isVisible['features'] ? 1 : 0,
    transition: `all 0.8s ease-out ${delay}s`,
  })

  const scaleIn = (delay = 0) => ({
    transform: isVisible['mission'] ? 'scale(1)' : 'scale(0.8)',
    opacity: isVisible['mission'] ? 1 : 0,
    transition: `all 0.6s ease-out ${delay}s`,
  })

  const features = [
    {
      icon: Shield,
      title: "100% Sản phẩm chính hãng",
      description: "Chúng tôi cam kết chỉ cung cấp các sản phẩm Apple chính hãng với nguồn gốc rõ ràng và bảo hành toàn cầu.",
      color: "from-green-500 to-emerald-500",
      delay: 0,
    },
    {
      icon: Brain,
      title: "Trải nghiệm mua sắm AI",
      description: "Gợi ý sản phẩm thông minh, hỗ trợ khách hàng và tìm kiếm nhanh chóng được hỗ trợ bởi AI.",
      color: "from-blue-500 to-purple-500",
      delay: 0.2,
    },
    {
      icon: Network,
      title: "Công nghệ Neural",
      description: "Sử dụng công nghệ mạng nơ-ron nhân tạo để xử lý dữ liệu, gợi ý sản phẩm phù hợp và tối ưu hóa dịch vụ.",
      color: "from-purple-500 to-pink-500",
      delay: 0.4,
    },
    {
      icon: Users,
      title: "Dịch vụ khách hàng tận tâm",
      description: "Hỗ trợ 24/7, chính sách đổi trả linh hoạt và bảo mật tuyệt đối thông tin khách hàng.",
      color: "from-orange-500 to-red-500",
      delay: 0.6,
    },
    {
      icon: Truck,
      title: "Giao hàng miễn phí toàn quốc",
      description: "Giao hàng nhanh chóng, chuyên nghiệp và đảm bảo sản phẩm được giao nguyên vẹn.",
      color: "from-cyan-500 to-blue-500",
      delay: 0.8,
    },
    {
      icon: Target,
      title: "Sứ mệnh của chúng tôi",
      description: "Trở thành nền tảng mua sắm Apple thông minh nhất Việt Nam bằng cách tận dụng AI để tối ưu hóa mọi trải nghiệm.",
      color: "from-indigo-500 to-purple-500",
      delay: 1.0,
    },
  ]

  const aiTechnologies = [
    {
      icon: Brain,
      title: "Neural Engine",
      description: "20-core Neural Engine xử lý 15.8 nghìn tỷ phép tính/giây",
      stats: "15.8 TOPS",
    },
    {
      icon: Eye,
      title: "Computer Vision",
      description: "Nhận diện đối tượng và xử lý hình ảnh thông minh",
      stats: "Real-time",
    },
    {
      icon: Waves,
      title: "Machine Learning",
      description: "Học máy tối ưu hóa hiệu suất và trải nghiệm người dùng",
      stats: "Adaptive",
    },
    {
      icon: Atom,
      title: "Quantum Processing",
      description: "Xử lý lượng tử cho các tác vụ AI phức tạp",
      stats: "Next-gen",
    },
  ]

  const stats = [
    { number: "1M+", label: "Khách hàng tin tưởng", icon: Users },
    { number: "99.9%", label: "Độ chính xác AI", icon: Brain },
    { number: "24/7", label: "Hỗ trợ không ngừng", icon: Shield },
    { number: "100%", label: "Sản phẩm chính hãng", icon: Award },
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
              <Link href="/supports/about" className="text-blue-400 font-medium">
                Giới thiệu
              </Link>
              <Link href="/supports/policy" className="text-gray-300 hover:text-white font-medium transition-all duration-300 hover:scale-105">
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

      <div className="pt-16">
        {/* Hero Section */}
        <section id="hero" data-animate className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <canvas ref={heroCanvasRef} className="absolute inset-0 w-full h-full" />
          
          <div className="relative z-10 container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8" style={slideInLeft}>
                <div className="space-y-6">
                  <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30 animate-pulse">
                    <Sparkles className="w-4 h-4 mr-2" />
                    About Hip Store
                  </Badge>
                  
                  <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                      Hip Store
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Trusted Apple Store
                    </span>
                  </h1>
                  
                  <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
                    Cửa hàng Apple đáng tin cậy của bạn với công nghệ AI tiên tiến. Chúng tôi tự hào mang đến cho bạn những sản phẩm Apple chính hãng, được tích hợp với công nghệ trí tuệ nhân tạo (AI) tiên tiến nhất hiện nay.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Khám phá sản phẩm
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-black border-gray-800 hover:bg-gray-700 hover:text-white transform hover:scale-105 transition-all duration-300"
                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Tìm hiểu thêm
                  </Button>
                </div>

                {/* Animated Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="text-center group cursor-pointer"
                      style={{ ...fadeInUp(index * 0.1), ...floatingAnimation }}
                    >
                      <stat.icon className="w-8 h-8 mx-auto mb-2 text-blue-400 group-hover:scale-125 transition-transform duration-300" />
                      <div className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {stat.number}
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
                        <Brain className="w-32 h-32 text-blue-400 animate-pulse" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating AI Icons */}
                  <div className="absolute inset-0 pointer-events-none">
                    <Cpu className="absolute top-10 left-10 w-8 h-8 text-green-400 animate-bounce" style={{ animationDelay: '0s' }} />
                    <Zap className="absolute top-20 right-10 w-6 h-6 text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
                    <Eye className="absolute bottom-20 left-20 w-7 h-7 text-purple-400 animate-bounce" style={{ animationDelay: '1s' }} />
                    <Atom className="absolute bottom-10 right-20 w-8 h-8 text-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
                    <Network className="absolute top-1/2 left-0 w-6 h-6 text-pink-400 animate-pulse" style={{ animationDelay: '1.5s' }} />
                    <Waves className="absolute top-1/2 right-0 w-7 h-7 text-indigo-400 animate-bounce" style={{ animationDelay: '2s' }} />
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

        {/* Features Section */}
        <section id="features" data-animate className="relative z-10 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4" style={fadeInUp()}>
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Tại sao chọn Hip Store?
                </span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto" style={fadeInUp(0.2)}>
                Chúng tôi không chỉ cung cấp các thiết bị Apple mới nhất, mà còn áp dụng các giải pháp AI tiên tiến dựa trên công nghệ neural để mang đến trải nghiệm mua sắm thông minh hơn, cá nhân hóa hơn và bảo mật tuyệt đối.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="group bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-4 overflow-hidden cursor-pointer hologram-effect"
                  style={fadeInUp(feature.delay)}
                >
                  <CardContent className="p-6 text-center relative z-10">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:rotate-12 transition-all duration-300`}
                      style={pulseAnimation}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-3 group-hover:text-blue-300 transition-colors text-lg">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                      {feature.description}
                    </p>
                    <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* AI Technologies Section */}
        <section className="relative z-10 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Công nghệ AI tiên tiến
                </span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Trải nghiệm sức mạnh của trí tuệ nhân tạo trong từng sản phẩm và dịch vụ
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {aiTechnologies.map((tech, index) => (
                <Card
                  key={index}
                  className="group bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer"
                  style={{ ...fadeInUp(index * 0.1), ...floatingAnimation }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center group-hover:rotate-12 transition-all duration-300">
                      <tech.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2 group-hover:text-blue-300 transition-colors">
                      {tech.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                      {tech.description}
                    </p>
                    <Badge className="bg-gradient-to-r from-green-500/20 to-blue-500/20 text-green-300 border-green-500/30">
                      {tech.stats}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section id="mission" data-animate className="relative z-10 py-20">
          <div className="container mx-auto px-4">
            <Card className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm border-white/10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
              <CardContent className="relative z-10 p-12 text-center" style={scaleIn()}>
                <Rocket className="w-16 h-16 mx-auto mb-6 text-blue-400 animate-pulse" />
                <h2 className="text-4xl font-bold mb-6 text-white">Sứ mệnh của chúng tôi</h2>
                <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                  Trở thành nền tảng mua sắm Apple thông minh nhất Việt Nam bằng cách tận dụng AI để tối ưu hóa mọi trải nghiệm, giúp khách hàng dễ dàng tiếp cận các sản phẩm công nghệ hàng đầu thế giới.
                </p>
                
                <div className="grid md:grid-cols-3 gap-8 mt-12">
                  {[
                    {
                      icon: Lightbulb,
                      title: "Đổi mới",
                      desc: "Luôn tiên phong trong việc áp dụng công nghệ AI mới nhất"
                    },
                    {
                      icon: Heart,
                      title: "Tận tâm",
                      desc: "Đặt khách hàng làm trung tâm trong mọi quyết định"
                    },
                    {
                      icon: Globe,
                      title: "Toàn cầu",
                      desc: "Kết nối Việt Nam với công nghệ Apple toàn thế giới"
                    }
                  ].map((value, index) => (
                    <div
                      key={index}
                      className="group cursor-pointer"
                      style={scaleIn(index * 0.2)}
                    >
                      <value.icon className="w-12 h-12 mx-auto mb-4 text-blue-400 group-hover:scale-125 transition-transform duration-300" />
                      <h3 className="text-white font-semibold mb-2 group-hover:text-blue-300 transition-colors">
                        {value.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{value.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Interactive CTA Section */}
        <section className="relative z-10 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-8">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Sẵn sàng trải nghiệm tương lai?
                </span>
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Khám phá thế giới Apple với công nghệ AI tiên tiến tại Hip Store
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Mua sắm ngay
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-black border-gray-800 hover:bg-gray-600 hover:text-white transform hover:scale-105 transition-all duration-300"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Về đầu trang
                </Button>
              </div>
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
                    <Link href="/supports/about" className="text-blue-400 font-medium">
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
