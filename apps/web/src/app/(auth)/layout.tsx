import Link from "next/link";
import { Kanban } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
          <Kanban className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-2xl font-bold">TaskForge</span>
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
