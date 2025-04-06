import "@/styles/notion.css";
import "@/styles/prism-theme.css";
import "katex/dist/katex.min.css";

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
