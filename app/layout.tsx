import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Radar — Monitor de Noticias',
  description: 'Monitor de noticias de marketing digital e IA',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  )
}
