import { type NextRequest, NextResponse } from "next/server"

// This is a mock API route - replace with your actual Go API endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, expiry } = body

    // Validate input
    if (!title || !content || !expiry) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Mock response - replace with actual API call to your Go backend
    const mockResponse = {
      success: true,
      status: 200,
      data: {
        id: crypto.randomUUID(),
        title,
        content,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + getExpiryMs(expiry)).toISOString(),
      },
    }

    return NextResponse.json(mockResponse)
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

function getExpiryMs(expiry: string): number {
  const expiryMap: Record<string, number> = {
    "10m": 10 * 60 * 1000,
    "1h": 60 * 60 * 1000,
    "1d": 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
    "30d": 30 * 24 * 60 * 60 * 1000,
  }
  return expiryMap[expiry] || 24 * 60 * 60 * 1000
}
