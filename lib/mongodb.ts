import { MongoClient, Db } from "mongodb"

const uri = process.env.MONGODB_URI!
if (!uri) throw new Error("❌ Missing MONGODB_URI in environment variables")

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!(global as any)._mongoClientPromise) {
  client = new MongoClient(uri)
  ;(global as any)._mongoClientPromise = client.connect()
}

clientPromise = (global as any)._mongoClientPromise

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db(process.env.MONGODB_DB || "apple-store")
}
