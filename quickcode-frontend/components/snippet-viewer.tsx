"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Copy, Clock, Calendar, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { CodeEditor } from "@/components/code-editor"

interface Snippet {
  id: string
  title: string
  content: string
  created_at: string
  expires_at: string
}

interface ApiResponse {
  success: boolean
  status: number
  data?: Snippet
  error?: string
}

interface SnippetViewerProps {
  snippetId: string
}

export function SnippetViewer({ snippetId }: SnippetViewerProps) {
  const [snippet, setSnippet] = useState<Snippet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        // Simulate API call - replace with your actual API endpoint
        const response = await fetch(`/api/snippets/${snippetId}`)
        const data: ApiResponse = await response.json()

        if (data.success && data.data) {
          setSnippet(data.data)
        } else if (data.status === 404) {
          setError("Snippet not found or has expired")
        } else {
          setError(data.error || "Failed to load snippet")
        }
      } catch (err) {
        setError("Failed to load snippet. Please check your connection.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSnippet()
  }, [snippetId])

  const copyToClipboard = async () => {
    if (!snippet) return

    try {
      await navigator.clipboard.writeText(snippet.content)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Code has been copied to clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please select and copy the text manually.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diff = expiry.getTime() - now.getTime()

    if (diff <= 0) return "Expired"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hours}h remaining`
    if (hours > 0) return `${hours}h ${minutes}m remaining`
    return `${minutes}m remaining`
  }

  if (isLoading) {
    return (
      <Card className="w-full bg-white/80 dark:bg-amber-950/80 backdrop-blur-sm border-amber-200 dark:border-amber-800">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-amber-600" />
            <p className="text-amber-700 dark:text-amber-300">Loading snippet...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full bg-white/80 dark:bg-amber-950/80 backdrop-blur-sm border-amber-200 dark:border-amber-800">
        <CardContent className="py-12">
          <Alert variant="destructive" className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-center">{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!snippet) {
    return (
      <Card className="w-full bg-white/80 dark:bg-amber-950/80 backdrop-blur-sm border-amber-200 dark:border-amber-800">
        <CardContent className="py-12">
          <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-center text-amber-700 dark:text-amber-300">
              Snippet not found
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const timeRemaining = getTimeRemaining(snippet.expires_at)
  const isExpired = timeRemaining === "Expired"

  return (
    <div className="space-y-6">
      <Card className="w-full bg-white/80 dark:bg-amber-950/80 backdrop-blur-sm border-amber-200 dark:border-amber-800">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl text-amber-900 dark:text-amber-100">{snippet.title}</CardTitle>
              <CardDescription className="text-amber-700 dark:text-amber-300">Snippet ID: {snippet.id}</CardDescription>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <Badge
                variant={isExpired ? "destructive" : "secondary"}
                className={
                  isExpired
                    ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                }
              >
                <Clock className="h-3 w-3 mr-1" />
                {timeRemaining}
              </Badge>
              <div className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Created: {formatDate(snippet.created_at)}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100">Code Content</h3>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="border-amber-200 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/50"
                disabled={isExpired}
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>

            {isExpired ? (
              <Alert variant="destructive" className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>This snippet has expired and is no longer available.</AlertDescription>
              </Alert>
            ) : (
              <div className="relative">
                <CodeEditor value={snippet.content} readOnly={true} height="auto" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
