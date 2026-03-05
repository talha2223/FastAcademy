import { prisma } from '@/lib/db';

export default async function AdminHome() {
  const [teacherCount, feeCount, postCount, adminCount] = await Promise.all([
    prisma.teacher.count(),
    prisma.feeItem.count(),
    prisma.post.count(),
    prisma.user.count()
  ]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="card p-6">
        <p className="text-sm uppercase tracking-wide text-slate-500">Teachers</p>
        <p className="mt-2 text-3xl font-semibold text-[color:var(--blue)]">{teacherCount}</p>
      </div>
      <div className="card p-6">
        <p className="text-sm uppercase tracking-wide text-slate-500">Fee Items</p>
        <p className="mt-2 text-3xl font-semibold text-[color:var(--red)]">{feeCount}</p>
      </div>
      <div className="card p-6">
        <p className="text-sm uppercase tracking-wide text-slate-500">Posts</p>
        <p className="mt-2 text-3xl font-semibold text-[color:var(--yellow)]">{postCount}</p>
      </div>
      <div className="card p-6">
        <p className="text-sm uppercase tracking-wide text-slate-500">Admins</p>
        <p className="mt-2 text-3xl font-semibold text-[color:var(--navy)]">{adminCount}</p>
      </div>
    </div>
  );
}