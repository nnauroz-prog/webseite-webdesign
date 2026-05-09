import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground mb-8 text-sm font-semibold tracking-tight transition-colors"
      >
        ← SitePilot
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
