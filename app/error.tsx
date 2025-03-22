"use client";

import { useRouter } from "next/navigation";

export default function Error({ error }: { error: Error }) {
  const router = useRouter();
  const reset = () => {
    router.refresh();
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Error</h1>
      <p className="text-2xl">{error.message}</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
