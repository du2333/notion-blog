import Link from "next/link";

export default function Tag({ tag }: { tag: string }) {
  return (
    <Link
      href={`/tag/${encodeURIComponent(tag)}`}
      className="text-sm font-semibold tracking-wide text-muted-foreground hover:text-foreground"
    >
      {`#${tag}`}
    </Link>
  );
}
