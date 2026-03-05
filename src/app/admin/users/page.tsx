import { prisma } from '@/lib/db';

function formatDateTime(date: Date | null) {
  if (!date) {
    return 'Never';
  }

  return new Intl.DateTimeFormat('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: [{ lastLoginAt: 'desc' }, { createdAt: 'desc' }]
  });

  const loggedInUsers = users.filter((user) => Boolean(user.lastLoginAt));

  return (
    <div className="grid gap-6">
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-[color:var(--navy)]">User Activity</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl bg-[color:var(--blue)]/10 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Total Accounts</p>
            <p className="mt-2 text-2xl font-semibold text-[color:var(--navy)]">{users.length}</p>
          </div>
          <div className="rounded-xl bg-[color:var(--yellow)]/20 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Logged In At Least Once</p>
            <p className="mt-2 text-2xl font-semibold text-[color:var(--navy)]">{loggedInUsers.length}</p>
          </div>
          <div className="rounded-xl bg-[color:var(--red)]/10 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Never Logged In</p>
            <p className="mt-2 text-2xl font-semibold text-[color:var(--navy)]">{users.length - loggedInUsers.length}</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-[color:var(--navy)]">All Users</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Last Login</th>
                <th className="px-3 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 text-slate-700">
                  <td className="px-3 py-2">{user.name ?? '-'}</td>
                  <td className="px-3 py-2">{user.email}</td>
                  <td className="px-3 py-2">{user.role}</td>
                  <td className="px-3 py-2">{formatDateTime(user.lastLoginAt)}</td>
                  <td className="px-3 py-2">{formatDateTime(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}