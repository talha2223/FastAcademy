import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import { ensureBaseData } from '@/lib/seed';
import { formatDate, whatsappLink } from '@/lib/utils';
import TeacherAvatar from '@/components/teacher-avatar';

export default async function HomePage() {
  await ensureBaseData();

  const settings = await prisma.siteSettings.findFirst();
  const teachers = await prisma.teacher.findMany({ orderBy: { order: 'asc' }, take: 4 });
  const allFees = await prisma.feeItem.findMany({ orderBy: { order: 'asc' } });
  const monthlyFee =
    allFees.find((fee) => /month/i.test(`${fee.title} ${fee.period}`)) ??
    allFees[0] ??
    null;
  const announcements = await prisma.post.findMany({
    where: { type: 'ANNOUNCEMENT', published: true },
    orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
    take: 3
  });
  const news = await prisma.post.findMany({
    where: { type: 'NEWS', published: true },
    orderBy: { createdAt: 'desc' },
    take: 3
  });
  const posts = await prisma.post.findMany({
    where: { type: 'POST', published: true },
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  return (
    <div>
      <section className="section">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2">
          <div className="stagger">
            <span className="badge">{settings?.heroBadge ?? 'Admissions Open'}</span>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-[color:var(--navy)]">
              {settings?.academyName ?? 'The Fast Academy of Sciences'}
            </h1>
            <p className="mt-4 text-lg text-slate-700">
              {settings?.tagline ?? 'Learn fast. Build strong foundations.'}
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href={settings?.heroCtaLink ?? whatsappLink(settings?.whatsapp ?? '+923216534920')}
                className="button-primary"
              >
                {settings?.heroCtaText ?? 'Contact on WhatsApp'}
              </a>
              <Link href="/about" className="button-outline">Explore Academy</Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 text-sm text-slate-600">
              <div className="card p-4 text-center">
                <p className="text-2xl font-semibold text-[color:var(--blue)]">{settings?.statOneValue ?? '25+'}</p>
                <p>{settings?.statOneLabel ?? 'Years Legacy'}</p>
              </div>
              <div className="card p-4 text-center">
                <p className="text-2xl font-semibold text-[color:var(--red)]">{settings?.statTwoValue ?? '12+'}</p>
                <p>{settings?.statTwoLabel ?? 'Expert Teachers'}</p>
              </div>
              <div className="card p-4 text-center">
                <p className="text-2xl font-semibold text-[color:var(--yellow)]">{settings?.statThreeValue ?? '1,000+'}</p>
                <p>{settings?.statThreeLabel ?? 'Students Trained'}</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-[color:var(--yellow)] opacity-40 blur-2xl" />
            <div className="card p-6">
              <Image
                src="/brand/logo.png"
                alt="Academy logo"
                width={420}
                height={420}
                className="mx-auto rounded-2xl"
              />
              <div className="mt-6 grid gap-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Location</span>
                  <span className="font-semibold text-slate-800">{settings?.address ?? 'D Block, Burewala City'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>WhatsApp</span>
                  <span className="font-semibold text-slate-800">{settings?.whatsapp ?? '+92 321 653 4920'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between">
            <h2 className="section-title">About the Academy</h2>
            <Link href="/about" className="text-sm font-semibold text-[color:var(--blue)]">Read more</Link>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-[1.4fr,1fr]">
            <div className="card p-6 text-slate-700">
              <p className="leading-relaxed">
                {settings?.aboutText ??
                  'We are a community-focused academy in Burewala committed to strong fundamentals, discipline, and modern learning methods.'}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="badge">{settings?.aboutBadgeOne ?? 'Result Focused'}</span>
                <span className="badge">{settings?.aboutBadgeTwo ?? 'Modern Labs'}</span>
                <span className="badge">{settings?.aboutBadgeThree ?? 'Mentoring'}</span>
              </div>
            </div>
            <div className="card p-6">
              <p className="text-lg font-semibold text-[color:var(--navy)]">{settings?.admissionsTitle ?? 'Admissions Desk'}</p>
              <p className="mt-2 text-sm text-slate-600">
                {settings?.admissionsText ?? 'Reach us on WhatsApp for admission guidance and updated fee details.'}
              </p>
              <a
                href={whatsappLink(settings?.whatsapp ?? '+923216534920')}
                className="mt-4 inline-flex text-sm font-semibold text-[color:var(--blue)]"
              >
                Chat on WhatsApp
              </a>
              <div className="mt-6 rounded-xl bg-[color:var(--blue)]/10 p-4 text-sm text-slate-700">
                <p className="font-semibold">Address</p>
                <p>{settings?.address ?? 'D Block, Burewala City'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Meet the Teachers</h2>
            <Link href="/teachers" className="text-sm font-semibold text-[color:var(--blue)]">View all</Link>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="card p-5">
                <TeacherAvatar
                  name={teacher.name}
                  photoUrl={teacher.photoUrl}
                  photoZoom={teacher.photoZoom}
                  photoPositionX={teacher.photoPositionX}
                  photoPositionY={teacher.photoPositionY}
                  className="h-14 w-14 overflow-hidden rounded-full bg-[color:var(--blue)]/10"
                  fallbackClassName="h-14 w-14 rounded-full bg-[color:var(--blue)]/10 text-[color:var(--blue)] flex items-center justify-center text-lg font-semibold"
                />
                <p className="mt-4 text-lg font-semibold text-[color:var(--navy)]">{teacher.name}</p>
                <p className="text-sm text-slate-600">{teacher.subject}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="section-title">Fees Overview</h2>
          {monthlyFee ? (
            <div className="mt-6 max-w-lg">
              <div className="card p-5">
                <p className="text-sm uppercase tracking-wide text-slate-500">{monthlyFee.period}</p>
                <p className="mt-2 text-xl font-semibold text-[color:var(--navy)]">{monthlyFee.title}</p>
                <p className="mt-3 text-3xl font-semibold text-[color:var(--blue)]">{monthlyFee.amount}</p>
                {monthlyFee.note ? <p className="mt-3 text-sm text-slate-600">{monthlyFee.note}</p> : null}
              </div>
            </div>
          ) : null}
          <p className="mt-4 text-sm text-slate-600">{settings?.feeNote}</p>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="section-title">Latest Announcements</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {announcements.map((item) => (
              <Link key={item.id} href={`/announcements/${item.slug}`} className="card p-5">
                <span className="badge">Announcement</span>
                <p className="mt-3 text-lg font-semibold text-[color:var(--navy)]">{item.title}</p>
                <p className="mt-2 text-sm text-slate-600">{item.excerpt}</p>
                <p className="mt-4 text-xs text-slate-500">{formatDate(item.createdAt)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-2">
          <div>
            <h2 className="section-title">News</h2>
            <div className="mt-6 grid gap-4">
              {news.map((item) => (
                <Link key={item.id} href={`/news/${item.slug}`} className="card p-5">
                  <p className="text-lg font-semibold text-[color:var(--navy)]">{item.title}</p>
                  <p className="mt-2 text-sm text-slate-600">{item.excerpt}</p>
                  <p className="mt-3 text-xs text-slate-500">{formatDate(item.createdAt)}</p>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="section-title">Posts</h2>
            <div className="mt-6 grid gap-4">
              {posts.map((item) => (
                <Link key={item.id} href={`/posts/${item.slug}`} className="card p-5">
                  <p className="text-lg font-semibold text-[color:var(--navy)]">{item.title}</p>
                  <p className="mt-2 text-sm text-slate-600">{item.excerpt}</p>
                  <p className="mt-3 text-xs text-slate-500">{formatDate(item.createdAt)}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-6xl px-4">
          <div className="card p-8 text-center">
            <h2 className="section-title">Contact & Address</h2>
            <p className="mt-4 text-slate-600">{settings?.address}</p>
            <a
              href={whatsappLink(settings?.whatsapp ?? '+923216534920')}
              className="mt-6 inline-flex text-sm font-semibold text-[color:var(--blue)]"
            >
              WhatsApp: {settings?.whatsapp ?? '+92 321 653 4920'}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
