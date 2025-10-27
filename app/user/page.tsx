"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { User, ShoppingBag, Settings, LogOut, Eye, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface UserData {
  id: string
  _id?: string // Thêm _id để tương thích với API
  name: string
  email: string
  phone?: string
  role: string
  isActive: boolean
  isApproved: boolean
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
  }
}

interface OrderData {
  _id: string
  orderNumber: string
  createdAt: string
  totalAmount: number
  status: string
}

export default function UserPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [orders, setOrders] = useState<OrderData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeForm, setActiveForm] = useState('login')
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  })
  
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  })
  
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: ""
    }
  })
  
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: ""
  })

  useEffect(() => {
    checkLoginStatus()
    const interval = setInterval(checkUserStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const checkLoginStatus = () => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.role === 'customer') {
        setUser(parsedUser)
        setIsLoggedIn(true)
        setProfileData({
          name: parsedUser.name || "",
          email: parsedUser.email || "",
          phone: parsedUser.phone || "",
          address: parsedUser.address || {
            street: "",
            city: "",
            state: "",
            zipCode: ""
          }
        })
        const userId = parsedUser._id || parsedUser.id
        console.log('User logged in with ID:', userId)
        fetchUserOrders(userId)
        checkUserStatus()
      }
    }
    setLoading(false)
  }

  const checkUserStatus = async () => {
    const userData = localStorage.getItem('user')
    if (!userData) return
    
    const parsedUser = JSON.parse(userData)
    try {
      const response = await fetch('/api/auth/check-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: parsedUser.id })
      })
      
      const data = await response.json()
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user))
        setUser(data.user)
        
        if (!data.user.isApproved || !data.user.isActive) {
          handleLogout()
          setError('Tài khoản của bạn đã bị vô hiệu hóa')
        }
      }
    } catch (error) {
      console.error('Error checking user status:', error)
    }
  }

  const fetchUserOrders = async (userId: string) => {
    try {
      console.log('Fetching orders for userId:', userId)
      const response = await fetch(`/api/orders?userId=${userId}`)
      const data = await response.json()
      console.log('Orders response:', data)
      if (data.success) {
        setOrders(data.data)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      console.log('User login attempt:', loginData)
      
      // Try to create user first if it doesn't exist
      if (loginData.email === 'hip@gmail.com' && loginData.password === '123') {
        await fetch('/api/add-user', { method: 'POST' })
      }
      
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
      })

      const data = await response.json()
      console.log('User login response:', data)

      if (data.success && data.user.role === 'customer') {
        console.log('Login user data:', data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
        setUser(data.user)
        setIsLoggedIn(true)
        const userId = data.user._id || data.user.id
        console.log('Fetching orders for user:', userId)
        fetchUserOrders(userId)
      } else {
        setError(data.message || "Email hoặc mật khẩu không đúng")
      }
    } catch (error: any) {
      console.error('User login error:', error)
      setError("Có lỗi xảy ra: " + (error.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (registerData.password !== registerData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          phone: registerData.phone,
          password: registerData.password
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(data.message)
        setActiveForm('login')
        setRegisterData({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: ""
        })
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError("Có lỗi xảy ra")
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: user.id,
          ...profileData
        })
      })

      const data = await response.json()
      if (data.success) {
        localStorage.setItem('user', JSON.stringify({...user, ...profileData}))
        setSuccess("Cập nhật thông tin thành công!")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch (error) {
      console.error("Logout error:", error)
    }
    
    localStorage.removeItem('user')
    setUser(null)
    setIsLoggedIn(false)
    setOrders([])
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Forgot password submitted:', forgotPasswordData)
    setError("")
    setSuccess("")

    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      return
    }

    if (forgotPasswordData.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự")
      return
    }

    try {
      console.log('Calling forgot-password API...')
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotPasswordData.email,
          newPassword: forgotPasswordData.newPassword
        })
      })

      const data = await response.json()
      console.log('Forgot password response:', data)

      if (data.success) {
        setSuccess(data.message)
        setForgotPasswordData({ email: "", newPassword: "", confirmPassword: "" })
        setTimeout(() => {
          setShowForgotPassword(false)
          setSuccess("")
          setActiveForm('login')
        }, 2000)
      } else {
        setError(data.message)
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      setError("Có lỗi xảy ra")
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự")
      return
    }

    try {
      console.log('User data:', user)
      console.log('User ID:', user?._id || user?.id)
      
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?._id || user?.id,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(data.message)
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
        setTimeout(() => {
          setShowChangePassword(false)
          setSuccess("")
        }, 2000)
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError("Có lỗi xảy ra")
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link href="/" className="text-2xl font-bold text-gray-900">Apple Store</Link>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto pt-16">
          <Card>
            <CardHeader>
              <div className="flex justify-center space-x-1">
                <Button
                  variant={activeForm === 'login' ? 'default' : 'ghost'}
                  onClick={() => setActiveForm('login')}
                  className="flex-1"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Đăng nhập
                </Button>
                <Button
                  variant={activeForm === 'register' ? 'default' : 'ghost'}
                  onClick={() => setActiveForm('register')}
                  className="flex-1"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Đăng ký
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                  {success}
                </div>
              )}

              {activeForm === 'login' ? (
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

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </Button>
                  
                  <div className="text-center mt-2">
                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                      Quên mật khẩu?
                    </Link>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Họ tên</Label>
                    <Input
                      id="name"
                      value={registerData.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegisterData({...registerData, name: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Input
                      id="password"
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Đăng ký
                  </Button>
                  
                  <p className="text-sm text-gray-600 text-center">
                    Tài khoản sẽ được kích hoạt sau khi admin duyệt
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-gray-900">Hip Store</Link>
              <Badge variant="secondary">Khách hàng</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Xin chào, {user?.name}</span>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="h-4 w-4 mr-2" />
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Thông tin cá nhân
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Đơn hàng của tôi
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Cài đặt
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
              </CardHeader>
              <CardContent>
                {success && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                    {success}
                  </div>
                )}
                
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Họ tên</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Địa chỉ giao hàng</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="street">Địa chỉ</Label>
                        <Input
                          id="street"
                          value={profileData.address.street}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            address: {...profileData.address, street: e.target.value}
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">Thành phố</Label>
                        <Input
                          id="city"
                          value={profileData.address.city}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            address: {...profileData.address, city: e.target.value}
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">Tỉnh/Thành</Label>
                        <Input
                          id="state"
                          value={profileData.address.state}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            address: {...profileData.address, state: e.target.value}
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">Mã bưu điện</Label>
                        <Input
                          id="zipCode"
                          value={profileData.address.zipCode}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            address: {...profileData.address, zipCode: e.target.value}
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit">Cập nhật thông tin</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Đơn hàng của tôi</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Bạn chưa có đơn hàng nào</p>
                    <Link href="/">
                      <Button className="mt-4">Mua sắm ngay</Button>
                    </Link>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mã đơn hàng</TableHead>
                        <TableHead>Ngày đặt</TableHead>
                        <TableHead>Tổng tiền</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell className="font-medium">{order.orderNumber}</TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                          </TableCell>
                          <TableCell>₫{order.totalAmount?.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={
                              order.status === 'completed' ? 'default' :
                              order.status === 'processing' ? 'secondary' :
                              order.status === 'pending' ? 'secondary' : 'destructive'
                            }>
                              {order.status === 'pending' ? 'Chờ xử lý' :
                               order.status === 'processing' ? 'Đang xử lý' :
                               order.status === 'completed' ? 'Hoàn thành' :
                               order.status === 'cancelled' ? 'Đã hủy' : order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt tài khoản</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Trạng thái tài khoản</h3>
                      <p className="text-sm text-gray-600">
                        {user?.isApproved ? 'Tài khoản đã được kích hoạt' : 'Tài khoản đang chờ duyệt'}
                      </p>
                    </div>
                    <Badge variant={user?.isApproved ? 'default' : 'secondary'}>
                      {user?.isApproved ? 'Đã kích hoạt' : 'Chờ duyệt'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Đổi mật khẩu</h3>
                      <p className="text-sm text-gray-600">Cập nhật mật khẩu của bạn</p>
                    </div>
                    <Button variant="outline" onClick={() => setShowChangePassword(true)}>Đổi mật khẩu</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Quên mật khẩu</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                {success}
              </div>
            )}

            <div>
              <Label htmlFor="forgotEmail">Email</Label>
              <Input
                id="forgotEmail"
                type="email"
                value={forgotPasswordData.email}
                onChange={(e) => setForgotPasswordData({...forgotPasswordData, email: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="forgotNewPassword">Mật khẩu mới</Label>
              <Input
                id="forgotNewPassword"
                type="password"
                value={forgotPasswordData.newPassword}
                onChange={(e) => setForgotPasswordData({...forgotPasswordData, newPassword: e.target.value})}
                required
                minLength={6}
              />
            </div>

            <div>
              <Label htmlFor="forgotConfirmPassword">Xác nhận mật khẩu mới</Label>
              <Input
                id="forgotConfirmPassword"
                type="password"
                value={forgotPasswordData.confirmPassword}
                onChange={(e) => setForgotPasswordData({...forgotPasswordData, confirmPassword: e.target.value})}
                required
                minLength={6}
              />
            </div>

            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowForgotPassword(false)} className="flex-1">
                Hủy
              </Button>
              <Button type="submit" className="flex-1">
                Đặt lại mật khẩu
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Đổi mật khẩu</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                {success}
              </div>
            )}

            <div>
              <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                required
                minLength={6}
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                required
                minLength={6}
              />
            </div>

            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowChangePassword(false)} className="flex-1">
                Hủy
              </Button>
              <Button type="submit" className="flex-1">
                Đổi mật khẩu
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}