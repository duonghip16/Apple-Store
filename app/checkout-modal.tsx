"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CheckoutModalProps {
  showCheckout: boolean
  setShowCheckout: (show: boolean) => void
  cartItems: any[]
  cartTotal: number
  checkoutData: {
    customerInfo: {
      name: string
      email: string
      phone: string
    }
    shippingAddress: {
      address: string
      city: string
      district: string
    }
    paymentMethod: string
  }
  setCheckoutData: (data: any) => void
  processCheckout: () => void
}

export default function CheckoutModal({
  showCheckout,
  setShowCheckout,
  cartItems,
  cartTotal,
  checkoutData,
  setCheckoutData,
  processCheckout
}: CheckoutModalProps) {
  return (
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
                <div key={item.id || item._id} className="flex justify-between items-center p-2 bg-white/5 rounded">
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
  )
}