"use client"

import { Moon, Sun } from "lucide-react"

export default function ThemeToggle({ isDarkMode, toggleTheme }: { isDarkMode: boolean, toggleTheme: () => void }) {
  return (
    <div className="w-full p-4 flex justify-end">
      <div className="flex items-center gap-3">
        <Moon className={`w-5 h-5 ${isDarkMode ? "text-amber-400" : "text-gray-400"}`} />
        <div
          onClick={toggleTheme}
          className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${
            isDarkMode ? "bg-gray-700" : "bg-blue-200"
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 ${
              isDarkMode ? "bg-gray-300 left-1" : "bg-white left-7"
            }`}
          ></div>
        </div>
        <Sun className={`w-5 h-5 ${!isDarkMode ? "text-amber-400" : "text-gray-400"}`} />
      </div>
    </div>
  )
}
