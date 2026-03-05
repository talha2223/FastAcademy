import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ensureBaseData } from '@/lib/seed';
import { whatsappLink } from '@/lib/utils';

export default async function SiteFooter() {
  await ensureBaseData();
  const settings = await prisma.siteSettings.findFirst();
  const whatsapp = settings?.whatsapp ?? '+923216534920';

  return (
    <footer className="mt-24 border-t border-white/60 bg-white/70">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold text-[color:var(--navy)]">
            {settings?.academyName ?? 'The Fast Academy of Sciences'}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            {settings?.tagline ?? 'Building strong foundations in Burewala with disciplined learning and modern methods.'}
          </p>
        </div>
        <div className="text-sm text-slate-600">
          <p className="font-semibold uppercase text-xs text-slate-500">Quick Links</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/about">About</Link>
            <Link href="/teachers">Teachers</Link>
            <Link href="/fees">Fees</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div className="text-sm text-slate-600">
          <p className="font-semibold uppercase text-xs text-slate-500">Contact</p>
          <div className="mt-3 flex flex-col gap-2">
            <span>{settings?.address ?? 'D Block, Burewala City'}</span>
            <a href={whatsappLink(whatsapp)} className="text-[color:var(--blue)]">
              WhatsApp: {whatsapp}
            </a>
            <span>{settings?.contactEmail ?? 'info@thefastacademy.edu.pk'}</span>
          </div>
        </div>
      </div>
      <div className="gradient-band h-1" />
      <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-slate-500">
        © {new Date().getFullYear()} {settings?.academyName ?? 'The Fast Academy of Sciences'}. All rights reserved.
      </div>
    </footer>
  );
}