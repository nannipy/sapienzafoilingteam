
'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { usePostHog } from 'posthog-js/react';

export function WebAnalytics() {
  const posthog = usePostHog();

  useReportWebVitals((metric) => {
    if (posthog) {
      posthog.capture('page_performance', {
        page: window.location.pathname,
        metric_name: metric.name,
        value: metric.value,
        rating: metric.rating,
      });
    }
  });

  return null;
}
