"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserCheck, UserX, Trash2, Download, RefreshCw } from "lucide-react"

interface CustomersTabProps {
  users: any[]
  onApprove: (userId: string) => void
  onToggleStatus: (userId: string, isActive: boolean) => void
  onDelete: (userId: string) => void
  onRefresh: () => void
}

export default function CustomersTab({ users, onApprove, onToggleStatus, onDelete, onRefresh }: CustomersTabProps) {
  const customers = users.filter(u => u.role === "customer")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Danh sách khách hàng</h3>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Xuất Excel
          </Button>
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Tải lại
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Duyệt</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? "default" : "destructive"}>
                      {user.isActive ? "Hoạt động" : "Khóa"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isApproved ? "default" : "secondary"}>
                      {user.isApproved ? "Đã duyệt" : "Chờ duyệt"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {!user.isApproved && (
                        <Button variant="ghost" size="sm" onClick={() => onApprove(user._id)}>
                          <UserCheck className="h-4 w-4 text-green-500" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onToggleStatus(user._id, !user.isActive)}
                      >
                        <UserX className="h-4 w-4 text-orange-500" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(user._id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
