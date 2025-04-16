import { Inter, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import MetaHead from "@/components/metahead";
import GoToTop from "@/components/go-to-top";
import { getSiteData } from "@/lib/notion/getSiteData";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const noto_sans_sc = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-noto-sans-sc",
});

export async function generateMetadata() {
  const { config: BlogConfig } = await getSiteData();
  return {
    title: {
      default: BlogConfig.BLOG_TITLE,
      template: "%s | " + BlogConfig.BLOG_TITLE,
    },
    description: BlogConfig.BLOG_DESCRIPTION,
    keywords: BlogConfig.BLOG_KEYWORDS,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <MetaHead />
      <body
        className={`${noto_sans_sc.className} ${inter.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
            <GoToTop />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
