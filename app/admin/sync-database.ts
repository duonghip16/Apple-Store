// Database synchronization utilities for admin panel

export interface SyncOptions {
  autoSync?: boolean
  syncInterval?: number // in milliseconds
  onSyncComplete?: (data: any) => void
  onSyncError?: (error: any) => void
}

export class DatabaseSync {
  private syncInterval: NodeJS.Timeout | null = null
  private options: SyncOptions

  constructor(options: SyncOptions = {}) {
    this.options = {
      autoSync: true,
      syncInterval: 30000, // 30 seconds
      ...options
    }
  }

  // Start automatic synchronization
  startAutoSync() {
    if (this.options.autoSync && this.options.syncInterval) {
      this.syncInterval = setInterval(() => {
        this.syncAll()
      }, this.options.syncInterval)
    }
  }

  // Stop automatic synchronization
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }

  // Sync all data
  async syncAll() {
    try {
      const [products, orders, users, reviews, analytics] = await Promise.all([
        this.syncProducts(),
        this.syncOrders(),
        this.syncUsers(),
        this.syncReviews(),
        this.syncAnalytics()
      ])

      const syncData = {
        products,
        orders,
        users,
        reviews,
        analytics,
        lastSync: new Date().toISOString()
      }

      // Store in localStorage as backup
      localStorage.setItem('admin_sync_data', JSON.stringify(syncData))
      localStorage.setItem('admin_last_sync', new Date().toISOString())

      if (this.options.onSyncComplete) {
        this.options.onSyncComplete(syncData)
      }

      return syncData
    } catch (error) {
      console.error('Sync error:', error)
      if (this.options.onSyncError) {
        this.options.onSyncError(error)
      }
      throw error
    }
  }

  // Sync products from main store
  async syncProducts() {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      
      if (data.success) {
        // Update localStorage
        localStorage.setItem('products', JSON.stringify(data.data))
        return data.data
      } else {
        // Fallback to localStorage
        const stored = localStorage.getItem('products')
        return stored ? JSON.parse(stored) : []
      }
    } catch (error) {
      console.error('Product sync error:', error)
      const stored = localStorage.getItem('products')
      return stored ? JSON.parse(stored) : []
    }
  }

  // Sync orders
  async syncOrders() {
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      
      if (data.success) {
        localStorage.setItem('orders', JSON.stringify(data.data))
        return data.data
      } else {
        const stored = localStorage.getItem('orders')
        return stored ? JSON.parse(stored) : []
      }
    } catch (error) {
      console.error('Order sync error:', error)
      const stored = localStorage.getItem('orders')
      return stored ? JSON.parse(stored) : []
    }
  }

  // Sync users
  async syncUsers() {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      
      if (data.success) {
        localStorage.setItem('users', JSON.stringify(data.data))
        return data.data
      } else {
        const stored = localStorage.getItem('users')
        return stored ? JSON.parse(stored) : []
      }
    } catch (error) {
      console.error('User sync error:', error)
      const stored = localStorage.getItem('users')
      return stored ? JSON.parse(stored) : []
    }
  }

  // Sync reviews
  async syncReviews() {
    try {
      const response = await fetch('/api/reviews')
      const data = await response.json()
      
      if (data.success) {
        localStorage.setItem('reviews', JSON.stringify(data.data))
        return data.data
      } else {
        const stored = localStorage.getItem('reviews')
        return stored ? JSON.parse(stored) : []
      }
    } catch (error) {
      console.error('Review sync error:', error)
      const stored = localStorage.getItem('reviews')
      return stored ? JSON.parse(stored) : []
    }
  }

  // Sync analytics data
  async syncAnalytics() {
    try {
      const response = await fetch('/api/analytics')
      const data = await response.json()
      
      if (data.success) {
        localStorage.setItem('analytics', JSON.stringify(data.data))
        return data.data
      } else {
        const stored = localStorage.getItem('analytics')
        return stored ? JSON.parse(stored) : null
      }
    } catch (error) {
      console.error('Analytics sync error:', error)
      const stored = localStorage.getItem('analytics')
      return stored ? JSON.parse(stored) : null
    }
  }

  // Sync cart data from main store
  async syncCartData() {
    try {
      // Get cart data from main store localStorage
      const cartData = localStorage.getItem('cart')
      const cartItems = cartData ? JSON.parse(cartData) : []

      // Process cart abandonment data
      const abandonedCarts = cartItems.filter((item: any) => {
        const lastUpdated = new Date(item.lastUpdated || item.addedAt)
        const hoursSinceUpdate = (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60)
        return hoursSinceUpdate > 24 // Consider abandoned after 24 hours
      })

      return {
        activeCartItems: cartItems.length,
        abandonedCarts: abandonedCarts.length,
        cartValue: cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
      }
    } catch (error) {
      console.error('Cart sync error:', error)
      return {
        activeCartItems: 0,
        abandonedCarts: 0,
        cartValue: 0
      }
    }
  }

  // Sync user activity from main store
  async syncUserActivity() {
    try {
      // Get user activity from localStorage or session storage
      const userSessions = JSON.parse(localStorage.getItem('user_sessions') || '[]')
      const pageViews = JSON.parse(localStorage.getItem('page_views') || '[]')
      
      return {
        activeSessions: userSessions.filter((session: any) => {
          const sessionTime = new Date(session.lastActivity)
          const minutesSinceActivity = (Date.now() - sessionTime.getTime()) / (1000 * 60)
          return minutesSinceActivity < 30 // Active if activity within 30 minutes
        }).length,
        totalPageViews: pageViews.length,
        popularPages: this.getPopularPages(pageViews)
      }
    } catch (error) {
      console.error('User activity sync error:', error)
      return {
        activeSessions: 0,
        totalPageViews: 0,
        popularPages: []
      }
    }
  }

  // Helper method to get popular pages
  private getPopularPages(pageViews: any[]) {
    const pageCount: { [key: string]: number } = {}
    
    pageViews.forEach((view: any) => {
      pageCount[view.page] = (pageCount[view.page] || 0) + 1
    })

    return Object.entries(pageCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([page, count]) => ({ page, count }))
  }

  // Generate real-time notifications
  generateNotifications(data: any) {
    const notifications = []

    // Low stock alerts
    if (data.products) {
      const lowStockProducts = data.products.filter((p: any) => p.stock < 20)
      if (lowStockProducts.length > 0) {
        notifications.push({
          id: `low-stock-${Date.now()}`,
          type: 'inventory',
          title: 'Cảnh báo tồn kho',
          message: `${lowStockProducts.length} sản phẩm sắp hết hàng`,
          priority: 'high',
          time: new Date(),
          read: false
        })
      }
    }

    // New orders
    if (data.orders) {
      const recentOrders = data.orders.filter((o: any) => {
        const orderTime = new Date(o.createdAt)
        const minutesSinceOrder = (Date.now() - orderTime.getTime()) / (1000 * 60)
        return minutesSinceOrder < 60 // Orders within last hour
      })

      if (recentOrders.length > 0) {
        notifications.push({
          id: `new-orders-${Date.now()}`,
          type: 'order',
          title: 'Đơn hàng mới',
          message: `${recentOrders.length} đơn hàng mới cần xử lý`,
          priority: 'medium',
          time: new Date(),
          read: false
        })
      }
    }

    // Pending user approvals
    if (data.users) {
      const pendingUsers = data.users.filter((u: any) => !u.isApproved)
      if (pendingUsers.length > 0) {
        notifications.push({
          id: `pending-users-${Date.now()}`,
          type: 'user',
          title: 'Khách hàng chờ duyệt',
          message: `${pendingUsers.length} khách hàng đang chờ phê duyệt`,
          priority: 'medium',
          time: new Date(),
          read: false
        })
      }
    }

    // Pending review approvals
    if (data.reviews) {
      const pendingReviews = data.reviews.filter((r: any) => !r.isApproved)
      if (pendingReviews.length > 0) {
        notifications.push({
          id: `pending-reviews-${Date.now()}`,
          type: 'review',
          title: 'Đánh giá chờ duyệt',
          message: `${pendingReviews.length} đánh giá đang chờ phê duyệt`,
          priority: 'low',
          time: new Date(),
          read: false
        })
      }
    }

    return notifications
  }

  // Get sync status
  getSyncStatus() {
    const lastSync = localStorage.getItem('admin_last_sync')
    const syncData = localStorage.getItem('admin_sync_data')
    
    return {
      lastSync: lastSync ? new Date(lastSync) : null,
      hasData: !!syncData,
      isAutoSyncActive: !!this.syncInterval
    }
  }

  // Force sync specific collection
  async forceSyncCollection(collection: string) {
    switch (collection) {
      case 'products':
        return await this.syncProducts()
      case 'orders':
        return await this.syncOrders()
      case 'users':
        return await this.syncUsers()
      case 'reviews':
        return await this.syncReviews()
      case 'analytics':
        return await this.syncAnalytics()
      default:
        throw new Error(`Unknown collection: ${collection}`)
    }
  }
}

// Export singleton instance
export const dbSync = new DatabaseSync()

// Auto-start sync when imported
if (typeof window !== 'undefined') {
  dbSync.startAutoSync()
}

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    dbSync.stopAutoSync()
  })
}
