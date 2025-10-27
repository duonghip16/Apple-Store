import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return "₫" + amount.toLocaleString("vi-VN")
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("vi-VN")
}

export function getStatusColor(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "completed":
    case "delivered":
    case "active":
      return "default"
    case "processing":
    case "confirmed":
      return "secondary"
    case "pending":
    case "cancelled":
    case "inactive":
      return "destructive"
    default:
      return "outline"
  }
}

export function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    completed: "Hoàn thành",
    delivered: "Đã giao",
    processing: "Đang xử lý",
    confirmed: "Đã xác nhận",
    shipped: "Đang giao",
    pending: "Chờ xử lý",
    cancelled: "Đã hủy",
    active: "Hoạt động",
    inactive: "Không hoạt động"
  }
  return statusMap[status] || status
}
