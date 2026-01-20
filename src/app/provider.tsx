'use client'

import { ThemeProvider } from 'next-themes'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import posthog from '@/lib/posthog'

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname) return

    let url = window.location.origin + pathname
    if (searchParams?.toString()) {
      url += `?${searchParams.toString()}`
    }

    posthog.capture('$pageview', {
      $current_url: url,
    })
  }, [pathname, searchParams])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  )
}
