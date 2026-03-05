import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import TeacherPhotoEditor from '@/components/teacher-photo-editor';
import { resolveUploadedImageUrl } from '@/lib/image-upload';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function readNumber(formData: FormData, field: string, fallback: number) {
  const parsed = Number(formData.get(field));
  return Number.isFinite(parsed) ? parsed : fallback;
}

async function createTeacher(formData: FormData) {
  'use server';
  await requireAdmin();
  const name = String(formData.get('name') ?? '').trim();
  const subject = String(formData.get('subject') ?? '').trim();
  const bio = String(formData.get('bio') ?? '').trim();
  const photoUrl = await resolveUploadedImageUrl({
    formData,
    fileField: 'photoFile',
    currentUrlField: 'currentPhotoUrl',
    removeField: 'removePhoto',
    folder: 'teachers'
  });
  const photoZoom = clamp(readNumber(formData, 'photoZoom', 1), 1, 3);
  const photoPositionX = clamp(readNumber(formData, 'photoPositionX', 50), 0, 100);
  const photoPositionY = clamp(readNumber(formData, 'photoPositionY', 50), 0, 100);
  const order = readNumber(formData, 'order', 0);

  if (!name || !subject) {
    return;
  }

  await prisma.teacher.create({
    data: {
      name,
      subject,
      bio: bio || null,
      photoUrl: photoUrl || null,
      photoZoom,
      photoPositionX,
      photoPositionY,
      order: Number.isNaN(order) ? 0 : order
    }
  });

  revalidatePath('/admin/teachers');
  revalidatePath('/teachers');
  revalidatePath('/');
}

async function updateTeacher(formData: FormData) {
  'use server';
  await requireAdmin();
  const id = String(formData.get('id') ?? '');
  const name = String(formData.get('name') ?? '').trim();
  const subject = String(formData.get('subject') ?? '').trim();
  const bio = String(formData.get('bio') ?? '').trim();
  const photoUrl = await resolveUploadedImageUrl({
    formData,
    fileField: 'photoFile',
    currentUrlField: 'currentPhotoUrl',
    removeField: 'removePhoto',
    folder: 'teachers'
  });
  const photoZoom = clamp(readNumber(formData, 'photoZoom', 1), 1, 3);
  const photoPositionX = clamp(readNumber(formData, 'photoPositionX', 50), 0, 100);
  const photoPositionY = clamp(readNumber(formData, 'photoPositionY', 50), 0, 100);
  const order = readNumber(formData, 'order', 0);

  if (!id || !name || !subject) {
    return;
  }

  await prisma.teacher.update({
    where: { id },
    data: {
      name,
      subject,
      bio: bio || null,
      photoUrl: photoUrl || null,
      photoZoom,
      photoPositionX,
      photoPositionY,
      order: Number.isNaN(order) ? 0 : order
    }
  });

  revalidatePath('/admin/teachers');
  revalidatePath('/teachers');
  revalidatePath('/');
}

async function deleteTeacher(formData: FormData) {
  'use server';
  await requireAdmin();
  const id = String(formData.get('id') ?? '');
  if (!id) {
    return;
  }

  await prisma.teacher.delete({ where: { id } });
  revalidatePath('/admin/teachers');
  revalidatePath('/teachers');
  revalidatePath('/');
}

export default async function AdminTeachersPage() {
  const teachers = await prisma.teacher.findMany({ orderBy: { order: 'asc' } });

  return (
    <div className="grid gap-8">
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-[color:var(--navy)]">Add Teacher</h2>
        <form action={createTeacher} encType="multipart/form-data" className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-slate-700">Name</label>
            <input name="name" required className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Subject</label>
            <input name="subject" required className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Order</label>
            <input name="order" type="number" defaultValue={0} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Bio</label>
            <textarea name="bio" rows={3} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
          </div>

          <TeacherPhotoEditor />

          <div className="md:col-span-2">
            <button type="submit" className="button-primary">Create</button>
          </div>
        </form>
      </div>

      <div className="grid gap-6">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="card p-6">
            <form action={updateTeacher} encType="multipart/form-data" className="grid gap-4 md:grid-cols-2">
              <input type="hidden" name="id" value={teacher.id} />
              <div>
                <label className="text-sm font-semibold text-slate-700">Name</label>
                <input name="name" defaultValue={teacher.name} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Subject</label>
                <input name="subject" defaultValue={teacher.subject} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Order</label>
                <input name="order" type="number" defaultValue={teacher.order} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">Bio</label>
                <textarea name="bio" rows={3} defaultValue={teacher.bio ?? ''} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
              </div>

              <TeacherPhotoEditor
                defaultPhotoUrl={teacher.photoUrl}
                defaultZoom={teacher.photoZoom}
                defaultX={teacher.photoPositionX}
                defaultY={teacher.photoPositionY}
              />

              <div className="md:col-span-2 flex flex-wrap gap-3">
                <button type="submit" className="button-primary">Save</button>
              </div>
            </form>
            <form action={deleteTeacher} className="mt-3">
              <input type="hidden" name="id" value={teacher.id} />
              <button type="submit" className="button-outline">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
