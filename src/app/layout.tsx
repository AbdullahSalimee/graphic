import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Graphy AI — The AI Graph Maker',
  description: 'From messy data to breathtaking charts in seconds. 87 chart types. Free.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
