import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Alfred — Monitor de Noticias',
  description: 'Monitor de noticias de marketing digital e IA',
  icons: {
    icon: 'https://rdkfjppgbvthvtjdkcgi.supabase.co/storage/v1/object/public/icons/alfred-favicon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={roboto.className}>
      <body className="bg-md-surface min-h-screen">{children}</body>
    </html>
  )
}
