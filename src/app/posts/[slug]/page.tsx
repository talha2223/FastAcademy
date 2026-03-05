import { prisma } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import Link from 'next/link';

interface PageProps {
  params: { slug: string };
}

export default async function PostDetail({ params }: PageProps) {
  const post = await prisma.post.findFirst({
    where: { slug: params.slug, type: 'POST' }
  });

  if (!post) {
    return (
      <section className="section">
        <div className="mx-auto max-w-3xl px-4">
          <p className="text-slate-600">Post not found.</p>
          <Link href="/posts" className="mt-4 inline-flex text-sm font-semibold text-[color:var(--blue)]">
            Back to posts
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="mx-auto max-w-3xl px-4">
        <Link href="/posts" className="text-sm font-semibold text-[color:var(--blue)]">
          ← Back to posts
        </Link>
        <h1 className="mt-4 text-3xl font-semibold text-[color:var(--navy)]">{post.title}</h1>
        <p className="mt-2 text-sm text-slate-500">{formatDate(post.createdAt)}</p>
        <div className="markdown mt-6 card p-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
            {post.contentMd}
          </ReactMarkdown>
        </div>
      </div>
    </section>
  );
}
