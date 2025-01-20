'use client';

import { useEffect, useState } from 'react';

export default function ClientBody({
  children,
  className,
  suppressHydrationWarning,
}: {
  children: React.ReactNode;
  className: string;
  suppressHydrationWarning?: boolean;
}) {
  // Use state to handle class names after hydration
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render children after first mount to ensure hydration matches
  return (
    <body className={className} suppressHydrationWarning={suppressHydrationWarning}>
      {mounted ? children : null}
    </body>
  );
}
