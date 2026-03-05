import { prisma } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import Link from 'next/link';

interface PageProps {
  params: { slug: string };
}

export default async function AnnouncementDetail({ params }: PageProps) {
  const announcement = await prisma.post.findFirst({
    where: { slug: params.slug, type: 'ANNOUNCEMENT' }
  });

  if (!announcement) {
    return (
      <section className="section">
        <div className="mx-auto max-w-3xl px-4">
          <p className="text-slate-600">Announcement not found.</p>
          <Link href="/announcements" className="mt-4 inline-flex text-sm font-semibold text-[color:var(--blue)]">
            Back to announcements
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="mx-auto max-w-3xl px-4">
        <Link href="/announcements" className="text-sm font-semibold text-[color:var(--blue)]">
          ← Back to announcements
        </Link>
        <h1 className="mt-4 text-3xl font-semibold text-[color:var(--navy)]">{announcement.title}</h1>
        <p className="mt-2 text-sm text-slate-500">{formatDate(announcement.createdAt)}</p>
        <div className="markdown mt-6 card p-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
            {announcement.contentMd}
          </ReactMarkdown>
        </div>
      </div>
    </section>
  );
}
