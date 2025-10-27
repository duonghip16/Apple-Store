"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, Trash2, Star, Download, RefreshCw } from "lucide-react"

interface ReviewsTabProps {
  reviews: any[]
  onApprove: (reviewId: string) => void
  onDelete: (reviewId: string) => void
  onRefresh: () => void
}

export default function ReviewsTab({ reviews, onApprove, onDelete, onRefresh }: ReviewsTabProps) {
  console.log('ReviewsTab - reviews:', reviews)
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Danh sách đánh giá ({reviews?.length || 0})</h3>
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
          {!reviews || reviews.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Chưa có đánh giá nào</p>
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Đánh giá</TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review, index) => (
                <TableRow key={`${review._id}-${index}`}>
                  <TableCell className="font-medium">{review.userName}</TableCell>
                  <TableCell>{review.productName || review.productId}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{review.comment}</TableCell>
                  <TableCell>
                    <Badge variant={review.isApproved ? "default" : "secondary"}>
                      {review.isApproved ? "Đã duyệt" : "Chờ duyệt"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {!review.isApproved && (
                        <Button variant="ghost" size="sm" onClick={() => onApprove(review._id)}>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => onDelete(review._id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
