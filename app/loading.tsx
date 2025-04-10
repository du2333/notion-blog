import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="container mx-auto flex h-screen items-center justify-center">
      <Spinner />
    </div>
  );
}
