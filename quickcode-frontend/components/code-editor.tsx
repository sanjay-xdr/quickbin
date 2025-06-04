"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface CodeEditorProps {
  value: string
  onChange?: (value: string) => void
  readOnly?: boolean
  height?: string
}

const languageOptions = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "sql", label: "SQL" },
  { value: "json", label: "JSON" },
  { value: "markdown", label: "Markdown" },
  { value: "php", label: "PHP" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
  { value: "ruby", label: "Ruby" },
  { value: "shell", label: "Shell/Bash" },
  { value: "yaml", label: "YAML" },
  { value: "plaintext", label: "Plain Text" },
]

// Function to detect language from code content
const detectLanguage = (code: string): string => {
  // Simple detection based on file extensions or common patterns
  if (code.includes("function") || code.includes("const") || code.includes("let") || code.includes("var")) {
    return "javascript"
  } else if (code.includes("import ") && code.includes("from ") && (code.includes(": ") || code.includes("<>"))) {
    return "typescript"
  } else if (code.includes("def ") || code.includes("import ") || (code.includes("class ") && code.includes(":"))) {
    return "python"
  } else if (code.includes("public class") || code.includes("public static void main")) {
    return "java"
  } else if (code.includes("#include") || code.includes("int main()")) {
    return "cpp"
  } else if (code.includes("<html") || code.includes("<!DOCTYPE")) {
    return "html"
  } else if (code.includes("SELECT") && code.includes("FROM")) {
    return "sql"
  } else if (code.trim().startsWith("{") || code.trim().startsWith("[")) {
    return "json"
  } else if (code.includes("<?php")) {
    return "php"
  } else if (code.includes("fn ") && code.includes("-> ")) {
    return "rust"
  } else if (code.includes("package main") || (code.includes("func ") && code.includes("() {"))) {
    return "go"
  } else if (code.includes("#!/bin/bash") || code.includes("echo ")) {
    return "shell"
  }

  // Default to JavaScript if we can't detect
  return "javascript"
}

export function CodeEditor({ value, onChange, readOnly = false, height = "300px" }: CodeEditorProps) {
  const [language, setLanguage] = useState<string>(() => detectLanguage(value))
  const [highlightedCode, setHighlightedCode] = useState<string>(value)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const preRef = useRef<HTMLPreElement>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Detect dark mode
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark")
      setIsDarkMode(isDark)

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === "class") {
            const isDark = document.documentElement.classList.contains("dark")
            setIsDarkMode(isDark)
          }
        })
      })

      observer.observe(document.documentElement, { attributes: true })
      return () => observer.disconnect()
    }
  }, [])

  // Handle syntax highlighting with Prism.js
  useEffect(() => {
    // We'll use a simple syntax highlighting approach for now
    // In a production app, you'd want to use a library like Prism.js or highlight.js
    // But for this demo, we'll just use some basic styling
    setHighlightedCode(value)
  }, [value, language])

  // Sync scroll between textarea and highlighted code
  useEffect(() => {
    const textarea = textareaRef.current
    const pre = preRef.current

    if (!textarea || !pre) return

    const handleScroll = () => {
      if (pre) {
        pre.scrollTop = textarea.scrollTop
        pre.scrollLeft = textarea.scrollLeft
      }
    }

    textarea.addEventListener("scroll", handleScroll)
    return () => textarea.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle tab key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab" && !readOnly) {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const newValue = value.substring(0, start) + "  " + value.substring(end)
      if (onChange) {
        onChange(newValue)
        // Set cursor position after tab
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2
          }
        }, 0)
      }
    }
  }

  return (
    <div className="space-y-2">
      {!readOnly && (
        <div className="flex items-center justify-end">
          <div className="w-48">
            <Label htmlFor="language-select" className="sr-only">
              Language
            </Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger
                id="language-select"
                className="border-amber-200 dark:border-amber-700 focus:border-amber-500 dark:focus:border-amber-400 bg-white dark:bg-amber-950/50"
              >
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="relative font-mono text-sm rounded-md overflow-hidden" style={{ height }}>
        <pre
          ref={preRef}
          className={`absolute top-0 left-0 w-full h-full m-0 p-4 overflow-auto whitespace-pre ${
            isDarkMode ? "bg-amber-950/50 text-amber-100" : "bg-white text-amber-900"
          } border ${isDarkMode ? "border-amber-700" : "border-amber-200"} rounded-md`}
          aria-hidden="true"
        >
          <code className={`language-${language}`}>{highlightedCode}</code>
        </pre>

<div style={{border:"1px solid red"}}>


        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={readOnly}
          spellCheck="false"
          className={`absolute top-0 left-0 w-full h-full m-0 p-4 overflow-auto resize-none bg-transparent text-transparent caret-amber-600 dark:caret-amber-400 outline-none border ${
            isDarkMode ? "border-amber-700" : "border-amber-200"
          } rounded-md`}
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            caretColor: isDarkMode ? "#fcd34d" : "#b45309",
          }}
        />
        </div>
      </div>
    </div>
  )
}
