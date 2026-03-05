import { prisma } from '@/lib/db';
import { ensureBaseData } from '@/lib/seed';
import { whatsappLink } from '@/lib/utils';

export default async function ContactPage() {
  await ensureBaseData();
  const settings = await prisma.siteSettings.findFirst();

  return (
    <section className="section">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="section-title">Contact</h1>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="card p-6">
            <p className="text-lg font-semibold text-[color:var(--navy)]">Address</p>
            <p className="mt-2 text-slate-600">{settings?.address ?? 'D Block, Burewala City'}</p>
            <p className="mt-4 text-lg font-semibold text-[color:var(--navy)]">WhatsApp</p>
            <a href={whatsappLink(settings?.whatsapp ?? '+923216534920')} className="mt-2 inline-flex text-[color:var(--blue)]">
              {settings?.whatsapp ?? '+92 321 653 4920'}
            </a>
            <p className="mt-4 text-lg font-semibold text-[color:var(--navy)]">Email</p>
            <p className="mt-2 text-slate-600">{settings?.contactEmail ?? 'info@thefastacademy.edu.pk'}</p>
          </div>
          <div className="card p-6">
            <p className="text-lg font-semibold text-[color:var(--navy)]">Office Hours</p>
            <p className="mt-2 text-slate-600">{settings?.officeHours ?? 'Monday - Saturday: 9:00 AM - 5:00 PM'}</p>
            <div className="mt-6 rounded-xl bg-[color:var(--blue)]/10 p-4 text-sm text-slate-700">
              <p className="font-semibold">{settings?.contactHelpTitle ?? 'Need help?'}</p>
              <p className="mt-2">{settings?.contactHelpText ?? 'Message us on WhatsApp for admissions and fee details.'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
