'use client'

import { Suspense } from 'react'
import { ThemeProvider } from 'next-themes'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import posthog from '@/lib/posthog'

function PostHogPageView() {
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

  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </ThemeProvider>
  )
}
