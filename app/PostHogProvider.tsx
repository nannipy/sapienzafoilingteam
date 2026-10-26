'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { usePathname } from 'next/navigation'
import { JSX, Suspense, useEffect } from 'react'
import React from 'react'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    capture_pageview: false, // Disable automatic pageview capture, as we capture manually
    opt_out_capturing_by_default: true, // Wait for explicit user consent
    respect_dnt: true // Respect Do Not Track headers
  })
}

function PostHogPageviewInternal(): JSX.Element {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname && !pathname.startsWith('/admin') && pathname !== '/login') {
      const url = window.origin + pathname
      posthog.capture(
        '$pageview',
        {
          '$current_url': url,
        }
      )
    }
  }, [pathname])

  return <></>
}

export function PostHogPageview() {
  return (
    <Suspense>
      <PostHogPageviewInternal />
    </Suspense>
  )
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
