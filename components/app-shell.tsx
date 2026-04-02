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
        <aside className="relative border-b border-white/10 bg-[#17285d] px-5 py-6 text-white lg:border-b-0 lg:border-r lg:border-white/10">
          <div className="mb-8 rounded-[1.1rem] border border-white/10 bg-white/4 p-5 shadow-[0_16px_34px_rgba(4,8,28,0.18)]">
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-sky-100/70">Pool Service App</p>
            <h1 className="font-display mt-3 text-[1.4rem] font-bold leading-tight">Bluewater Route Desk</h1>
            <div className="mt-5 rounded-[0.9rem] bg-white/8 p-3">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="mt-1 text-[0.68rem] uppercase tracking-[0.18em] text-slate-300">{user.role.replaceAll("_", " ")}</p>
            </div>
          </div>
          <nav className="space-y-2">
            {navItems
              .filter((item) => !item.roles || item.roles.includes(user.role))
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block rounded-lg px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/6 hover:text-white",
                    pathname === item.href && "bg-white text-slate-950 shadow-[0_10px_24px_rgba(10,16,40,0.18)] hover:bg-white",
                  )}
                >
                  {item.label}
                </Link>
              ))}
          </nav>
          <form action={logoutAction} className="mt-8">
            <button type="submit" className="rounded-lg border border-white/14 bg-white/6 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10">
              Sign out
            </button>
          </form>
        </aside>
        <main className="relative p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
