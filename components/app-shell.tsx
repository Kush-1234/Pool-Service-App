import Link from "next/link";
import { Role } from "@prisma/client";
import { destroySession, SessionUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

const navItems: { href: string; label: string; roles?: Role[] }[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/customers", label: "Customers", roles: ["OWNER"] },
  { href: "/pools", label: "Pools", roles: ["OWNER", "OPERATIONS_MANAGER"] },
  { href: "/schedule", label: "Schedule", roles: ["OWNER", "OPERATIONS_MANAGER"] },
  { href: "/jobs", label: "Jobs", roles: ["OWNER", "OPERATIONS_MANAGER"] },
  { href: "/my-jobs", label: "My Jobs", roles: ["TECHNICIAN"] },
  { href: "/checklists", label: "Checklists", roles: ["OWNER", "OPERATIONS_MANAGER"] },
  { href: "/reports", label: "Reports", roles: ["OWNER", "OPERATIONS_MANAGER"] },
  { href: "/team", label: "Team", roles: ["OWNER"] },
  { href: "/settings", label: "Settings" },
];

export function AppShell({
  user,
  pathname,
  children,
}: {
  user: SessionUser;
  pathname: string;
  children: React.ReactNode;
}) {
  async function logoutAction() {
    "use server";
    await destroySession();
  }

  return (
    <div className="app-wave-bg min-h-screen">
      <div className="grid min-h-screen lg:grid-cols-[290px_1fr]">
        <aside className="ocean-panel relative border-b border-white/10 px-5 py-6 text-white lg:border-b-0 lg:border-r lg:border-white/10">
          <div className="mb-8 rounded-[1.6rem] border border-white/10 bg-white/5 p-5 shadow-[0_24px_60px_rgba(4,8,28,0.28)]">
            <p className="text-[0.68rem] uppercase tracking-[0.32em] text-sky-200/80">Pool Service App</p>
            <h1 className="font-display mt-3 text-[1.8rem] font-bold leading-none">Bluewater Route Desk</h1>
            <div className="mt-5 rounded-[1.35rem] bg-white/10 p-3">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="mt-1 text-[0.68rem] uppercase tracking-[0.22em] text-cyan-100/80">{user.role.replaceAll("_", " ")}</p>
            </div>
            <div className="wave-lines mt-5 h-12 rounded-2xl opacity-70" />
          </div>
          <nav className="space-y-2">
            {navItems
              .filter((item) => !item.roles || item.roles.includes(user.role))
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block rounded-2xl px-4 py-3 text-sm font-medium text-slate-200/88 hover:bg-white/8 hover:text-white",
                    pathname === item.href && "bg-[linear-gradient(135deg,#ff972f,#ff7f32)] text-slate-950 shadow-[0_18px_36px_rgba(255,151,47,0.22)] hover:bg-[linear-gradient(135deg,#ff972f,#ff7f32)]",
                  )}
                >
                  {item.label}
                </Link>
              ))}
          </nav>
          <form action={logoutAction} className="mt-8">
            <button type="submit" className="rounded-2xl border border-white/14 bg-white/6 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10">
              Sign out
            </button>
          </form>
        </aside>
        <main className="relative p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
