import Link from "next/link";
import { CheckCircle, Kanban, Users, Zap, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Kanban,
    title: "Kanban Boards",
    description: "Visualize your workflow with drag-and-drop kanban boards. Move tasks through stages effortlessly.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together in real-time. Assign tasks, leave comments, and keep everyone on the same page.",
  },
  {
    icon: CheckCircle,
    title: "Task Management",
    description: "Create, organize, and track tasks with priorities, labels, and due dates.",
  },
  {
    icon: Zap,
    title: "Fast & Intuitive",
    description: "Built for speed with a clean, modern interface. Spend less time managing and more time doing.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Kanban className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">TaskForge</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-24 sm:py-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_50%)]" />
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Manage Projects{" "}
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                Effortlessly
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              TaskForge brings your team together with powerful project management tools.
              Plan, track, and deliver — all in one place.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to ship faster
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Powerful features designed for modern teams.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TaskForge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
