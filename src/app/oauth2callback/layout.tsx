import Script from 'next/script'
import React from 'react'
 
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <section>{children}</section>
      <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" />
    </>
  )
}