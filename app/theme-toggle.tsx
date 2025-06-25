"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center space-x-2 px-3 py-2 rounded-md border border-border bg-background text-foreground hover:bg-accent transition-colors"
      title={`切换到${theme === "dark" ? "浅色" : "深色"}模式`}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
 
    </button>
  )
} 