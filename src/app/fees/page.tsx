import { prisma } from '@/lib/db';
import { ensureBaseData } from '@/lib/seed';

export default async function FeesPage() {
  await ensureBaseData();
  const settings = await prisma.siteSettings.findFirst();
  const allFees = await prisma.feeItem.findMany({ orderBy: { order: 'asc' } });
  const monthlyFee =
    allFees.find((fee) => /month/i.test(`${fee.title} ${fee.period}`)) ??
    allFees[0] ??
    null;

  return (
    <section className="section">
      <div className="mx-auto max-w-5xl px-4">
        <h1 className="section-title">Fees</h1>
        <p className="mt-2 text-slate-600">Updated fee structure for the current session.</p>
        {monthlyFee ? (
          <div className="mt-8 max-w-xl">
            <div className="card p-6">
              <p className="text-sm uppercase tracking-wide text-slate-500">{monthlyFee.period}</p>
              <p className="mt-2 text-xl font-semibold text-[color:var(--navy)]">{monthlyFee.title}</p>
              <p className="mt-3 text-3xl font-semibold text-[color:var(--blue)]">{monthlyFee.amount}</p>
              {monthlyFee.note ? <p className="mt-3 text-sm text-slate-600">{monthlyFee.note}</p> : null}
            </div>
          </div>
        ) : null}
        <p className="mt-6 text-sm text-slate-600">{settings?.feeNote}</p>
      </div>
    </section>
  );
}
