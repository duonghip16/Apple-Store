import type { Product, Order, User, Review } from "@/types"

export const api = {
  products: {
    getAll: async () => {
      const res = await fetch("/api/products")
      return res.json()
    },
    create: async (data: Partial<Product>) => {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      return res.json()
    },
    update: async (id: string, data: Partial<Product>) => {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id, ...data })
      })
      return res.json()
    },
    delete: async (id: string) => {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" })
      return res.json()
    }
  },

  orders: {
    getAll: async () => {
      const res = await fetch("/api/orders")
      return res.json()
    },
    updateStatus: async (id: string, status: string) => {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id, status })
      })
      return res.json()
    },
    delete: async (id: string) => {
      const res = await fetch(`/api/orders?id=${id}`, { method: "DELETE" })
      return res.json()
    }
  },

  users: {
    getAll: async () => {
      const res = await fetch("/api/users")
      return res.json()
    },
    approve: async (id: string) => {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id, isApproved: true })
      })
      return res.json()
    },
    toggleStatus: async (id: string, isActive: boolean) => {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id, isActive })
      })
      return res.json()
    },
    delete: async (id: string) => {
      const res = await fetch(`/api/users?id=${id}`, { method: "DELETE" })
      return res.json()
    }
  },

  reviews: {
    getAll: async () => {
      const res = await fetch("/api/reviews")
      return res.json()
    },
    approve: async (id: string) => {
      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id, isApproved: true })
      })
      return res.json()
    },
    delete: async (id: string) => {
      const res = await fetch(`/api/reviews?id=${id}`, { method: "DELETE" })
      return res.json()
    }
  },

  analytics: {
    get: async () => {
      const res = await fetch("/api/analytics")
      return res.json()
    }
  }
}
