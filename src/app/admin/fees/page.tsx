import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

function pickMonthlyFee<T extends { title: string; period: string }>(fees: T[]) {
  return fees.find((fee) => /month/i.test(`${fee.title} ${fee.period}`)) ?? fees[0] ?? null;
}

async function saveMonthlyFee(formData: FormData) {
  'use server';
  await requireAdmin();

  const amount = String(formData.get('amount') ?? '').trim();
  const note = String(formData.get('note') ?? '').trim();

  if (!amount) {
    return;
  }

  const fees = await prisma.feeItem.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] });
  const target = pickMonthlyFee(fees);

  if (target) {
    await prisma.feeItem.update({
      where: { id: target.id },
      data: {
        title: 'Monthly Tuition',
        period: 'Per month',
        amount,
        note: note || null,
        order: 1
      }
    });

    await prisma.feeItem.deleteMany({
      where: {
        id: { not: target.id }
      }
    });
  } else {
    await prisma.feeItem.create({
      data: {
        title: 'Monthly Tuition',
        period: 'Per month',
        amount,
        note: note || null,
        order: 1
      }
    });
  }

  revalidatePath('/admin/fees');
  revalidatePath('/fees');
  revalidatePath('/');
}

export default async function AdminFeesPage() {
  const fees = await prisma.feeItem.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] });
  const monthlyFee = pickMonthlyFee(fees);

  return (
    <div className="grid gap-8">
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-[color:var(--navy)]">Monthly Fee</h2>
        <p className="mt-2 text-sm text-slate-600">
          Only one monthly fee is shown on the website. Admission and exam fees are removed.
        </p>

        <form action={saveMonthlyFee} className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-slate-700">Title</label>
            <input
              value="Monthly Tuition"
              readOnly
              className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Period</label>
            <input
              value="Per month"
              readOnly
              className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Amount</label>
            <input
              name="amount"
              required
              defaultValue={monthlyFee?.amount ?? 'PKR 3,500'}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Note</label>
            <input
              name="note"
              defaultValue={monthlyFee?.note ?? ''}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="button-primary">Save Monthly Fee</button>
          </div>
        </form>
      </div>
    </div>
  );
}
