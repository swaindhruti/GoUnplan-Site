import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      {/* Header - Reduced height */}
      <header className="border-b py-2">
        <div className="container mx-auto flex justify-between items-center h-12 px-4">
          <div className="text-3xl font-bold">Unplan</div>
          <div className="flex gap-10">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg">
                Start Planning
              </Button>
            </Link>
            <Link href="/dashboard/host">
              <Button size="lg" className="text-lg">
                Host
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - More compact */}
      <main className="flex-1 flex items-center justify-center">
        <div className="container mx-auto flex flex-col items-center justify-center px-4 text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-2">
            Unplan
          </h1>
          <p className="text-2xl md:text-4xl mb-4 text-muted-foreground">
            Travel with vibe
          </p>
          <p className="max-w-3xl mb-6 text-muted-foreground text-2xl">
            Discover spontaneous adventures tailored to your style. Travel
            without constraints, embracing the unexpected.
          </p>
          <div className="flex gap-3">
            <Button className="text-lg" size="lg">
              Get Started
            </Button>
            <Button variant="outline" className="text-lg" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </main>

      {/* Footer - Minimized */}
      <footer className="border-t py-2">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          <p>© 2024 Unplan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
