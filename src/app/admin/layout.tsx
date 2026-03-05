import Link from 'next/link';
import type { ReactNode } from 'react';
import { requireAdmin } from '@/lib/auth';
import LogoutButton from '@/components/logout-button';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <section className="section">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold text-[color:var(--navy)]">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-semibold text-[color:var(--blue)]">
              View Site
            </Link>
            <LogoutButton />
          </div>
        </div>
        <nav className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/admin" className="button-outline">Overview</Link>
          <Link href="/admin/content" className="button-outline">Content</Link>
          <Link href="/admin/teachers" className="button-outline">Teachers</Link>
          <Link href="/admin/fees" className="button-outline">Fees</Link>
          <Link href="/admin/settings" className="button-outline">Site Settings</Link>
          <Link href="/admin/admins" className="button-outline">Admins</Link>
          <Link href="/admin/users" className="button-outline">All Users</Link>
        </nav>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}