import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function POST() {
  try {
    const db = await getDatabase()
    
    // Check if collections exist
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map(c => c.name)
    
    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      stats: {
        collections: collectionNames.length,
        names: collectionNames
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to initialize database",
        details: error.message || 'Unknown error',
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST method to initialize database",
    endpoint: "/api/init-database",
    method: "POST",
  })
}
