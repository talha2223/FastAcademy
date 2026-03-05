'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSession, signIn } from 'next-auth/react';
import { ROLES } from '@/lib/roles';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') ?? '';
  const registered = searchParams.get('registered') === '1';
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '').trim();
    const password = String(form.get('password') ?? '');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password
    });

    if (result?.error) {
      setLoading(false);
      setError('Invalid email or password.');
      return;
    }

    const session = await getSession();
    const role = session?.user?.role;
    const requestedPath = from.startsWith('/') ? from : '/';

    setLoading(false);

    if (role === ROLES.ADMIN) {
      if (requestedPath.startsWith('/admin')) {
        router.push(requestedPath);
      } else {
        router.push('/admin');
      }
      return;
    }

    router.push('/');
  }

  return (
    <section className="section">
      <div className="mx-auto max-w-md px-4">
        <h1 className="section-title text-center">Sign In</h1>
        <p className="mt-2 text-center text-sm text-slate-600">Sign in to continue.</p>
        <div className="mt-6 card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <input
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <input
                name="password"
                type="password"
                required
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                placeholder="********"
              />
            </div>
            {registered ? <p className="text-sm text-green-700">Account created. Please sign in.</p> : null}
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button type="submit" className="button-primary w-full justify-center" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-slate-500">
            New user? <Link href="/signup" className="text-[color:var(--blue)]">Create account</Link>
          </p>
        </div>
      </div>
    </section>
  );
}