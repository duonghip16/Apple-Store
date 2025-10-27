import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await getDatabase()

    // Get database stats
    const stats = await db.stats()

    // Get collections info
    const collections = await db.listCollections().toArray()
    const collectionsInfo = await Promise.all(
      collections.map(async (collection) => {
        const collectionStats = await (db.collection(collection.name) as any).stats()
        return {
          name: collection.name,
          documents: collectionStats.count || 0,
          size: collectionStats.size || 0,
          indexes: collectionStats.nindexes || 0,
        }
      }),
    )

    return NextResponse.json({
      success: true,
      data: {
        status: "connected",
        database: stats.db,
        collections: collectionsInfo,
        totalDocuments: collectionsInfo.reduce((sum, col) => sum + col.documents, 0),
        totalSize: stats.dataSize || 0,
        indexes: collectionsInfo.reduce((sum, col) => sum + col.indexes, 0),
      },
    })
  } catch (error: any) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to connect to database",
        details: error.message || 'Unknown error',
      },
      { status: 500 },
    )
  }
}
