import { NextResponse } from "next/server"

// Mock data for when database is not available
const mockStats = {
  id: 1,
  date: new Date().toISOString(),
  purchases_today: 45,
  purchases_month: 1250,
  purchases_total: 15780,
  earned_last_month: 125000.5,
  earned_this_month: 89750.25,
  earned_total: 2450000.75,
  net_last_month: 95000.4,
  net_this_month: 68200.2,
  net_total: 1960000.6,
  payout_sellers_last_month: 30000.1,
}

export async function GET() {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      console.log("DATABASE_URL not configured, using mock data")
      return NextResponse.json(mockStats)
    }

    // Try to import pg dynamically
    let pool
    try {
      const { Pool } = await import("pg")
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      })
    } catch (importError) {
      console.log("pg package not available, using mock data:", importError)
      return NextResponse.json(mockStats)
    }

    const client = await pool.connect()

    try {
      // Get the most recent sales statistics record
      const result = await client.query(`
        SELECT 
          id,
          date,
          purchases_today,
          purchases_month,
          purchases_total,
          earned_last_month,
          earned_this_month,
          earned_total,
          net_last_month,
          net_this_month,
          net_total,
          payout_sellers_last_month
        FROM sales_stats 
        ORDER BY date DESC 
        LIMIT 1
      `)

      if (result.rows.length === 0) {
        console.log("No sales statistics found in database, using mock data")
        return NextResponse.json(mockStats)
      }

      const stats = result.rows[0]

      // Convert decimal fields to numbers
      const formattedStats = {
        ...stats,
        earned_last_month: Number.parseFloat(stats.earned_last_month) || 0,
        earned_this_month: Number.parseFloat(stats.earned_this_month) || 0,
        earned_total: Number.parseFloat(stats.earned_total) || 0,
        net_last_month: Number.parseFloat(stats.net_last_month) || 0,
        net_this_month: Number.parseFloat(stats.net_this_month) || 0,
        net_total: Number.parseFloat(stats.net_total) || 0,
        payout_sellers_last_month: Number.parseFloat(stats.payout_sellers_last_month) || 0,
      }

      return NextResponse.json(formattedStats)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Database error:", error)
    console.log("Falling back to mock data due to database error")
    return NextResponse.json(mockStats)
  }
}
