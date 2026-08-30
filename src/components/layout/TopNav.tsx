import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { Avatar, ButtonLink, Icon, Logo } from "@/components/ui";
import { MobileNav } from "./MobileNav";
import { getCart } from "@/server/services/cart";

const links = [
  ["Discover", "/discover"],
  ["Orders", "/orders"],
  ["Bookings", "/bookings"],
] as const;

export async function TopNav() {
  const session = await auth();
  const user = session?.user;
  const isBusiness = user?.roles.some((r) => r === "seller" || r === "provider");
  const count = user ? (await getCart(user.id).catch(() => ({ items: [] as { qty: number }[] }))).items.reduce((s, i) => s + i.qty, 0) : 0;
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center gap-8 px-6 lg:px-12">
        <Logo />
        <nav className="hidden items-center gap-6 md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="text-sm font-semibold text-muted hover:text-ink">
              {label}
            </Link>
          ))}
        </nav>
        <form action="/discover" className="ml-auto hidden max-w-[420px] flex-1 items-center gap-2.5 rounded-md border border-border bg-surface px-3.5 text-muted lg:flex">
          <Icon name="search" size={18} />
          <input name="q" placeholder="Search cakes, nails, laptop repair…" className="h-11 w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted" />
        </form>
        <div className="ml-auto flex items-center gap-4 lg:ml-0">
          {isBusiness ? (
            <ButtonLink href="/dashboard" variant="secondary" size="sm" className="hidden sm:inline-flex">Dashboard</ButtonLink>
          ) : (
            <ButtonLink href="/sell" variant="secondary" size="sm" className="hidden sm:inline-flex">Start selling</ButtonLink>
          )}
          <Link href="/cart" aria-label="Cart" className="relative text-ink"><Icon name="cart" size={22} />{count ? <span className="absolute -right-2 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-pill bg-accent px-1 text-[11px] font-bold text-ink">{count}</span> : null}</Link>
          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/orders" className="flex items-center gap-2" title="My orders"><Avatar name={user.name ?? "?"} /><span className="hidden text-sm font-semibold lg:inline">{user.name?.split(" ")[0]}</span></Link>
              <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
                <button type="submit" title="Log out" aria-label="Log out" className="flex size-9 items-center justify-center rounded-md text-muted hover:bg-bg hover:text-ink"><Icon name="logout" size={18} /></button>
              </form>
            </div>
          ) : (
            <ButtonLink href="/login" variant="outline" size="sm" className="hidden sm:inline-flex">Log in</ButtonLink>
          )}
          <MobileNav links={links} loggedIn={!!user} />
        </div>
      </div>
    </header>
  );
}
