import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ensureBaseData } from '@/lib/seed';
import { ROLES } from '@/lib/roles';

export default async function SiteHeader() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === ROLES.ADMIN;
  const isLoggedIn = Boolean(session?.user);
  await ensureBaseData();
  const settings = await prisma.siteSettings.findFirst();

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-full bg-white shadow">
            <Image src="/brand/logo.png" alt="Academy logo" width={48} height={48} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">{settings?.headerLabel ?? 'THE FAST'}</p>
            <p className="text-lg font-semibold text-[color:var(--navy)]">
              {settings?.academyName ?? 'Academy of Sciences'}
            </p>
          </div>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-700 lg:flex">
          <Link href="/about" className="hover:text-[color:var(--blue)]">About</Link>
          <Link href="/teachers" className="hover:text-[color:var(--blue)]">Teachers</Link>
          <Link href="/fees" className="hover:text-[color:var(--blue)]">Fees</Link>
          <Link href="/announcements" className="hover:text-[color:var(--blue)]">Announcements</Link>
          <Link href="/news" className="hover:text-[color:var(--blue)]">News</Link>
          <Link href="/posts" className="hover:text-[color:var(--blue)]">Posts</Link>
          <Link href="/contact" className="hover:text-[color:var(--blue)]">Contact</Link>
        </nav>
        <div className="flex items-center gap-3">
          {isAdmin ? (
            <>
              <Link href="/admin" className="button-primary">Admin Panel</Link>
              <Link href="/profile" className="button-outline">Profile</Link>
            </>
          ) : isLoggedIn ? (
            <Link href="/profile" className="button-primary">Profile</Link>
          ) : (
            <Link href="/login" className="button-primary">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}