import { prisma } from '@/lib/db';
import { ensureBaseData } from '@/lib/seed';

export default async function AboutPage() {
  await ensureBaseData();
  const settings = await prisma.siteSettings.findFirst();

  return (
    <section className="section">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="section-title">About Us</h1>
        <div className="mt-6 card p-6 text-slate-700">
          <p className="leading-relaxed">
            {settings?.aboutText ??
              'We are a community-focused academy in Burewala committed to strong fundamentals, discipline, and modern learning methods.'}
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-[color:var(--blue)]/10 p-4">
              <p className="text-sm uppercase tracking-wide text-slate-500">Address</p>
              <p className="mt-2 font-semibold text-slate-800">{settings?.address ?? 'D Block, Burewala City'}</p>
            </div>
            <div className="rounded-xl bg-[color:var(--yellow)]/20 p-4">
              <p className="text-sm uppercase tracking-wide text-slate-500">WhatsApp</p>
              <p className="mt-2 font-semibold text-slate-800">{settings?.whatsapp ?? '+92 321 653 4920'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}