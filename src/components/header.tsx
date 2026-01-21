"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { History, Palette, Plus, User, LogOut } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-border/30">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="copics home"
        >
          <div className="p-2 rounded-xl bg-pastel-peach/60 group-hover:bg-pastel-coral/60 transition-colors">
            <Palette className="w-5 h-5 text-primary" aria-hidden="true" />
          </div>
          <span className="font-semibold text-lg">copics</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2" aria-label="main navigation">
          {session?.user ? (
            <>
              <Link href="/new">
                <Button
                  variant={pathname === "/new" ? "secondary" : "ghost"}
                  size="sm"
                  className="gap-2"
                  aria-label="create new analysis"
                  aria-current={pathname === "/new" ? "page" : undefined}
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">new</span>
                </Button>
              </Link>
              <Link href="/history">
                <Button
                  variant={pathname === "/history" ? "secondary" : "ghost"}
                  size="sm"
                  className="gap-2"
                  aria-label="view analysis history"
                  aria-current={pathname === "/history" ? "page" : undefined}
                >
                  <History className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">history</span>
                </Button>
              </Link>
              <div className="ml-2 pl-2 border-l border-border/50">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                      aria-label="user menu"
                    >
                      <div className="w-8 h-8 rounded-full bg-pastel-peach flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" aria-hidden="true" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      disabled
                      className="text-xs text-muted-foreground"
                    >
                      {session.user.email}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut} className="gap-2">
                      <LogOut className="w-4 h-4" aria-hidden="true" />
                      sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : !isPending ? (
            <Link href="/sign-in">
              <Button size="sm">sign in</Button>
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
