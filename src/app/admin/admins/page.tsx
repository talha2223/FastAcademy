import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { ROLES } from '@/lib/roles';

async function createAdminUser(formData: FormData) {
  'use server';
  await requireAdmin();

  const email = String(formData.get('email') ?? '').toLowerCase().trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: ROLES.ADMIN
    }
  });

  revalidatePath('/admin/admins');
}

async function deleteAdminUser(formData: FormData) {
  'use server';
  await requireAdmin();

  const id = String(formData.get('id') ?? '');
  if (!id) {
    return;
  }

  const target = await prisma.user.findUnique({
    where: { id },
    select: { role: true }
  });
  if (!target || target.role !== ROLES.ADMIN) {
    return;
  }

  const adminCount = await prisma.user.count({ where: { role: ROLES.ADMIN } });
  if (adminCount <= 1) {
    return;
  }

  await prisma.user.delete({ where: { id } });
  revalidatePath('/admin/admins');
}

export default async function AdminUsersPage() {
  const admins = await prisma.user.findMany({
    where: { role: ROLES.ADMIN },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="grid gap-8">
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-[color:var(--navy)]">Add Admin</h2>
        <form action={createAdminUser} className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-slate-700">Email</label>
            <input name="email" type="email" required className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <input name="password" type="password" required className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="button-primary">Create Admin</button>
          </div>
        </form>
      </div>

      <div className="grid gap-4">
        {admins.map((admin) => (
          <div key={admin.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="text-sm text-slate-500">Admin</p>
              <p className="font-semibold text-slate-800">{admin.email}</p>
            </div>
            <form action={deleteAdminUser}>
              <input type="hidden" name="id" value={admin.id} />
              <button type="submit" className="button-outline">Delete</button>
            </form>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500">Note: The last remaining admin cannot be deleted.</p>
    </div>
  );
}
