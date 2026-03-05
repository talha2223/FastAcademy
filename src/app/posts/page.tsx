import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ensureBaseData } from '@/lib/seed';
import { formatDate } from '@/lib/utils';

export default async function PostsPage() {
  await ensureBaseData();
  const posts = await prisma.post.findMany({
    where: { type: 'POST', published: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <section className="section">
      <div className="mx-auto max-w-5xl px-4">
        <h1 className="section-title">Posts</h1>
        <p className="mt-2 text-slate-600">Helpful tips, guides, and updates.</p>
        <div className="mt-8 grid gap-6">
          {posts.map((item) => (
            <Link key={item.id} href={`/posts/${item.slug}`} className="card p-6">
              <div className="flex items-center justify-between">
                <span className="badge">Post</span>
                <span className="text-xs text-slate-500">{formatDate(item.createdAt)}</span>
              </div>
              <p className="mt-3 text-lg font-semibold text-[color:var(--navy)]">{item.title}</p>
              <p className="mt-2 text-sm text-slate-600">{item.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}