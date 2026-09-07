import type { Metadata } from "next";
import { Geist, Geist_Mono, Pacifico, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pacifico',
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Synqoro — AI-Powered Building Operations",
  description: "Synqoro connects facilities, assets, compliance, engineers, IoT systems, and AI automation into one intelligent platform. Enterprise-grade smart building operations.",
  keywords: "facilities management, smart buildings, digital twin, AI operations, building automation, IoT, compliance management",
  authors: [{ name: "Synqoro" }],
  openGraph: {
    title: "Synqoro — AI-Powered Building Operations",
    description: "Synqoro connects facilities, assets, compliance, engineers, IoT systems, and AI automation into one intelligent platform.",
    type: "website",
    siteName: "Synqoro",
  },
  twitter: {
    card: "summary_large_image",
    title: "Synqoro — AI-Powered Building Operations",
    description: "Synqoro connects facilities, assets, compliance, engineers, IoT systems, and AI automation into one intelligent platform.",
  },
  applicationName: "Synqoro",
  appleWebApp: {
    title: "Synqoro",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} ${inter.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <script 
          src="https://readdy.ai/api/public/assistant/widget?projectId=6121b988-d17a-4e78-88c7-36ae831086ae"
          strategy="afterInteractive"
          mode="hybrid"
          voice-show-transcript="true"
          theme="dark"
          size="compact"
          accent-color="#14B8A6"
          button-base-color="#FFFFFF"
          button-accent-color="#0F172A"
        ></script>
      </body>
    </html>
  );
}