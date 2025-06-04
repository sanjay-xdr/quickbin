"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Send, Clock } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { CodeEditor } from "@/components/code-editor"

const EXPIRY_OPTIONS = [
  { value: "10m", label: "10 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "1d", label: "1 day" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
]
 console.log(process.env.NEXT_PUBLIC_QUICKBIN_API_URL ," URL");

 const URL=process.env.NEXT_PUBLIC_QUICKBIN_API_URL

 if(!URL){
  throw new Error("URL IS NOT DEFINED")
 }

interface ApiResponse {
  success: boolean
  status: number
  data?: {
    id: string
    title: string
    content: string
    created_at: string
    expires_at: string
  }
  error?: string
}

export function CreateSnippetForm() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [expiry, setExpiry] = useState("1d")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!title.trim()) {
      setError("Title is required")
      return
    }

    if (!content.trim()) {
      setError("Content is required")
      return
    }

    if (title.length > 100) {
      setError("Title must be less than 100 characters")
      return
    }

    if (content.length > 50000) {
      setError("Content must be less than 50,000 characters")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call - replace with your actual API endpoint

     
      const response = await fetch(`${URL}/snippets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          expiry,
        }),
      })

      const data: ApiResponse = await response.json()
      console.log("RESPONSE FROM API ", data);

      if (data.success && data.data) {
        toast({
          title: "Snippet created!",
          description: "Your code snippet has been created successfully.",
        })
        router.push(`/snippets/${data.data.id}`)
      } else {
        throw new Error(data.error || "Failed to create snippet")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
      toast({
        title: "Error",
        description: "Failed to create snippet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white/80 dark:bg-amber-950/80 backdrop-blur-sm border-amber-200 dark:border-amber-800">
      <CardHeader>
        <CardTitle className="text-amber-900 dark:text-amber-100">New Code Snippet</CardTitle>
        <CardDescription className="text-amber-700 dark:text-amber-300">
          Create a new code snippet to share with others
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title" className="text-amber-900 dark:text-amber-100">
              Title
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter a descriptive title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-amber-200 dark:border-amber-700 focus:border-amber-500 dark:focus:border-amber-400 bg-white dark:bg-amber-950/50"
              maxLength={100}
              disabled={isLoading}
            />
            <p className="text-xs text-amber-600 dark:text-amber-400">{title.length}/100 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-amber-900 dark:text-amber-100">
              Code Content
            </Label>
            <CodeEditor value={content} onChange={setContent} height="300px" readOnly={isLoading} />
            <p className="text-xs text-amber-600 dark:text-amber-400">{content.length}/50,000 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiry" className="text-amber-900 dark:text-amber-100 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Expires In
            </Label>
            <Select value={expiry} onValueChange={setExpiry} disabled={isLoading}>
              <SelectTrigger className="border-amber-200 dark:border-amber-700 focus:border-amber-500 dark:focus:border-amber-400 bg-white dark:bg-amber-950/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPIRY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !title.trim() || !content.trim()}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-700 dark:hover:bg-amber-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Snippet...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Create Snippet
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
