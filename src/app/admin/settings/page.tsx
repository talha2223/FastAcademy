import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { ensureBaseData } from '@/lib/seed';
import { revalidatePath } from 'next/cache';

async function updateSettings(formData: FormData) {
  'use server';
  await requireAdmin();

  const id = String(formData.get('id') ?? '');
  const academyName = String(formData.get('academyName') ?? '').trim();
  const headerLabel = String(formData.get('headerLabel') ?? '').trim();
  const tagline = String(formData.get('tagline') ?? '').trim();
  const aboutText = String(formData.get('aboutText') ?? '').trim();
  const address = String(formData.get('address') ?? '').trim();
  const whatsapp = String(formData.get('whatsapp') ?? '').trim();
  const contactEmail = String(formData.get('contactEmail') ?? '').trim();
  const heroBadge = String(formData.get('heroBadge') ?? '').trim();
  const heroCtaText = String(formData.get('heroCtaText') ?? '').trim();
  const heroCtaLink = String(formData.get('heroCtaLink') ?? '').trim();
  const statOneValue = String(formData.get('statOneValue') ?? '').trim();
  const statOneLabel = String(formData.get('statOneLabel') ?? '').trim();
  const statTwoValue = String(formData.get('statTwoValue') ?? '').trim();
  const statTwoLabel = String(formData.get('statTwoLabel') ?? '').trim();
  const statThreeValue = String(formData.get('statThreeValue') ?? '').trim();
  const statThreeLabel = String(formData.get('statThreeLabel') ?? '').trim();
  const aboutBadgeOne = String(formData.get('aboutBadgeOne') ?? '').trim();
  const aboutBadgeTwo = String(formData.get('aboutBadgeTwo') ?? '').trim();
  const aboutBadgeThree = String(formData.get('aboutBadgeThree') ?? '').trim();
  const admissionsTitle = String(formData.get('admissionsTitle') ?? '').trim();
  const admissionsText = String(formData.get('admissionsText') ?? '').trim();
  const officeHours = String(formData.get('officeHours') ?? '').trim();
  const contactHelpTitle = String(formData.get('contactHelpTitle') ?? '').trim();
  const contactHelpText = String(formData.get('contactHelpText') ?? '').trim();
  const feeNote = String(formData.get('feeNote') ?? '').trim();

  if (!id || !academyName) {
    return;
  }

  await prisma.siteSettings.update({
    where: { id },
    data: {
      academyName,
      headerLabel,
      tagline,
      aboutText,
      address,
      whatsapp,
      contactEmail,
      heroBadge,
      heroCtaText,
      heroCtaLink,
      statOneValue,
      statOneLabel,
      statTwoValue,
      statTwoLabel,
      statThreeValue,
      statThreeLabel,
      aboutBadgeOne,
      aboutBadgeTwo,
      aboutBadgeThree,
      admissionsTitle,
      admissionsText,
      officeHours,
      contactHelpTitle,
      contactHelpText,
      feeNote
    }
  });

  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/contact');
  revalidatePath('/fees');
  revalidatePath('/admin/settings');
}

export default async function AdminSettingsPage() {
  await ensureBaseData();
  const settings = await prisma.siteSettings.findFirst();

  if (!settings) {
    return <p className="text-slate-600">Settings not found.</p>;
  }

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold text-[color:var(--navy)]">Site Settings</h2>
      <form action={updateSettings} className="mt-4 grid gap-4 md:grid-cols-2">
        <input type="hidden" name="id" value={settings.id} />

        <div>
          <label className="text-sm font-semibold text-slate-700">Academy Name</label>
          <input name="academyName" defaultValue={settings.academyName} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Header Label</label>
          <input name="headerLabel" defaultValue={settings.headerLabel} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">Tagline</label>
          <input name="tagline" defaultValue={settings.tagline} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Hero Badge</label>
          <input name="heroBadge" defaultValue={settings.heroBadge} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-slate-700">About Text</label>
          <textarea name="aboutText" rows={4} defaultValue={settings.aboutText} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">Address</label>
          <input name="address" defaultValue={settings.address} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">WhatsApp</label>
          <input name="whatsapp" defaultValue={settings.whatsapp} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">Contact Email</label>
          <input name="contactEmail" defaultValue={settings.contactEmail} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Hero CTA Text</label>
          <input name="heroCtaText" defaultValue={settings.heroCtaText} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-slate-700">Hero CTA Link</label>
          <input name="heroCtaLink" defaultValue={settings.heroCtaLink} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">Stat 1 Value</label>
          <input name="statOneValue" defaultValue={settings.statOneValue} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Stat 1 Label</label>
          <input name="statOneLabel" defaultValue={settings.statOneLabel} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">Stat 2 Value</label>
          <input name="statTwoValue" defaultValue={settings.statTwoValue} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Stat 2 Label</label>
          <input name="statTwoLabel" defaultValue={settings.statTwoLabel} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">Stat 3 Value</label>
          <input name="statThreeValue" defaultValue={settings.statThreeValue} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Stat 3 Label</label>
          <input name="statThreeLabel" defaultValue={settings.statThreeLabel} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">About Badge 1</label>
          <input name="aboutBadgeOne" defaultValue={settings.aboutBadgeOne} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">About Badge 2</label>
          <input name="aboutBadgeTwo" defaultValue={settings.aboutBadgeTwo} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-slate-700">About Badge 3</label>
          <input name="aboutBadgeThree" defaultValue={settings.aboutBadgeThree} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">Admissions Title</label>
          <input name="admissionsTitle" defaultValue={settings.admissionsTitle} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Office Hours</label>
          <input name="officeHours" defaultValue={settings.officeHours} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-slate-700">Admissions Text</label>
          <textarea name="admissionsText" rows={3} defaultValue={settings.admissionsText} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">Help Title</label>
          <input name="contactHelpTitle" defaultValue={settings.contactHelpTitle} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Fee Note</label>
          <input name="feeNote" defaultValue={settings.feeNote} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-slate-700">Help Text</label>
          <textarea name="contactHelpText" rows={2} defaultValue={settings.contactHelpText} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>

        <div className="md:col-span-2">
          <button type="submit" className="button-primary">Save Settings</button>
        </div>
      </form>
    </div>
  );
}
