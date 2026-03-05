import { prisma } from '@/lib/db';
import { ensureBaseData } from '@/lib/seed';
import TeacherAvatar from '@/components/teacher-avatar';

export default async function TeachersPage() {
  await ensureBaseData();
  const teachers = await prisma.teacher.findMany({ orderBy: { order: 'asc' } });

  return (
    <section className="section">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="section-title">Teachers</h1>
        <p className="mt-2 text-slate-600">Meet our experienced subject specialists.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="card p-6">
              <TeacherAvatar
                name={teacher.name}
                photoUrl={teacher.photoUrl}
                photoZoom={teacher.photoZoom}
                photoPositionX={teacher.photoPositionX}
                photoPositionY={teacher.photoPositionY}
                className="h-16 w-16 overflow-hidden rounded-full bg-[color:var(--red)]/10"
                fallbackClassName="h-16 w-16 rounded-full bg-[color:var(--red)]/10 text-[color:var(--red)] flex items-center justify-center text-lg font-semibold"
              />
              <p className="mt-4 text-lg font-semibold text-[color:var(--navy)]">{teacher.name}</p>
              <p className="text-sm text-slate-600">{teacher.subject}</p>
              {teacher.bio ? <p className="mt-3 text-sm text-slate-600">{teacher.bio}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
