import Head from "next/head";
import { getSiteData } from "@/lib/notion/getSiteData";

export default async function MetaHead() {
  const { config } = await getSiteData();

  return (
    <Head>
      <link
        rel="icon"
        type="image/png"
        href="/favicon-96x96.png"
        sizes="96x96"
      />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <meta name="apple-mobile-web-app-title" content={config.BLOG_TITLE} />
      <link rel="manifest" href="/site.webmanifest" />
    </Head>
  );
}
