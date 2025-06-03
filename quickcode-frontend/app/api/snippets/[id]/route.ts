import { type NextRequest, NextResponse } from "next/server"

// This is a mock API route - replace with your actual Go API endpoint
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Mock response - replace with actual API call to your Go backend
    // This simulates different scenarios for testing
    if (id === "expired") {
      return NextResponse.json({ success: false, error: "Snippet has expired" }, { status: 404 })
    }

    if (id === "notfound") {
      return NextResponse.json({ success: false, error: "Snippet not found" }, { status: 404 })
    }

    // Mock successful response
    const mockResponse = {
      success: true,
      status: 200,
      data: {
        id,
        title: "Sample Code Snippet",
        content: `// Sample JavaScript code
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // Output: 55

// This is a sample code snippet
// Replace this with your actual content`,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
      },
    }

    return NextResponse.json(mockResponse)
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
