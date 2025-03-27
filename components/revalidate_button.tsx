"use client";

import { revalidate } from "@/actions";

interface RevalidateButtonProps {
  path: string;
}

export default function RevalidateButton({ path }: RevalidateButtonProps) {
  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded-md"
      onClick={() => revalidate(path)}
    >
      刷新
    </button>
  );
}
