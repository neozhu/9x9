"use client"

import * as React from "react"
import { useTheme } from "next-themes"

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
      <span className="text-sm">
        {theme === "dark" ? "🌞" : "🌙"}
      </span>
      <span className="text-xs hidden sm:inline">
        {theme === "dark" ? "浅色" : "深色"}
      </span>
    </button>
  )
} 