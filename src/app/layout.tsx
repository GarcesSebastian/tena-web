import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../styles/globals.css"

import { UserDataProvider } from "@/hooks/useUserData"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Taller - Tena Web",
  description: "Ni idea",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="shortcut icon" href="/logo-buni.png" type="image/x-icon" />
      </head>
      <body className={inter.className}>
        <div className="h-screen">
          <div className="flex">
            <UserDataProvider>
              <Suspense>
                <main className="w-full">{children}</main>
              </Suspense>
            </UserDataProvider>
          </div>
        </div>
      </body>
    </html>
  )
}