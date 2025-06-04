import { CreateSnippetForm } from "@/components/create-snippet-form"
import { ThemeToggle } from "@/components/theme-toggle"
import { Code2 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-600 rounded-lg">
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-amber-900 dark:text-amber-100">quickCode</h1>
              <p className="text-sm text-amber-700 dark:text-amber-300">Share code snippets instantly</p>
            </div>
          </div>
    
        </header>

        <main className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-amber-900 dark:text-amber-100 mb-4">Create a New Snippet</h2>
            <p className="text-amber-700 dark:text-amber-300 max-w-2xl mx-auto">
              Share your code with others. Choose an expiry time and get a shareable link instantly.
            </p>
          </div>

          <CreateSnippetForm />
        </main>
      </div>
    </div>
  )
}
