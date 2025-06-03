import { SnippetViewer } from "@/components/snippet-viewer"
import { ThemeToggle } from "@/components/theme-toggle"
import { Code2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface SnippetPageProps {
  params: {
    id: string
  }
}

export default function SnippetPage({ params }: SnippetPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-600 rounded-lg">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-amber-900 dark:text-amber-100">quickCode</h1>
              </div>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <main className="max-w-6xl mx-auto">
          <SnippetViewer snippetId={params.id} />
        </main>
      </div>
    </div>
  )
}
