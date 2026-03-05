/* eslint-disable @next/next/no-img-element */
import bcrypt from 'bcryptjs';
import LogoutButton from '@/components/logout-button';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ROLES } from '@/lib/roles';
import { resolveUploadedImageUrl } from '@/lib/image-upload';

async function updateProfile(formData: FormData) {
  'use server';
  const session = await requireUser();

  const name = String(formData.get('name') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const bio = String(formData.get('bio') ?? '').trim();
  const photoUrl = await resolveUploadedImageUrl({
    formData,
    fileField: 'photoFile',
    currentUrlField: 'currentPhotoUrl',
    removeField: 'removePhoto',
    folder: 'profiles'
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: name || null,
      phone: phone || null,
      bio: bio || null,
      photoUrl
    }
  });

  redirect('/profile?saved=1');
}

async function changePassword(formData: FormData) {
  'use server';
  const session = await requireUser();

  const currentPassword = String(formData.get('currentPassword') ?? '');
  const newPassword = String(formData.get('newPassword') ?? '');
  const confirmPassword = String(formData.get('confirmPassword') ?? '');

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    redirect('/profile?error=User%20not%20found');
  }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    redirect('/profile?error=Current%20password%20is%20incorrect');
  }

  if (newPassword.length < 6) {
    redirect('/profile?error=New%20password%20must%20be%20at%20least%206%20characters');
  }

  if (newPassword !== confirmPassword) {
    redirect('/profile?error=Passwords%20do%20not%20match');
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash }
  });

  redirect('/profile?password=1');
}

export default async function ProfilePage({
  searchParams
}: {
  searchParams: { saved?: string; password?: string; error?: string };
}) {
  const session = await requireUser();
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user) {
    redirect('/login');
  }

  const isAdmin = user.role === ROLES.ADMIN;

  return (
    <section className="section">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="section-title">Profile Settings</h1>
        <p className="mt-2 text-sm text-slate-600">Update your profile information and account password.</p>

        {searchParams?.saved ? <p className="mt-4 text-sm text-green-700">Profile updated successfully.</p> : null}
        {searchParams?.password ? <p className="mt-4 text-sm text-green-700">Password changed successfully.</p> : null}
        {searchParams?.error ? <p className="mt-4 text-sm text-red-600">{decodeURIComponent(searchParams.error)}</p> : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <p className="text-sm uppercase tracking-wide text-slate-500">Account</p>
            <p className="mt-2 text-lg font-semibold text-[color:var(--navy)]">{user.email}</p>
            <p className="mt-2 text-sm text-slate-600">Role: {isAdmin ? 'Admin' : 'User'}</p>
            {user.photoUrl ? (
              <img
                src={user.photoUrl}
                alt="Profile"
                className="mt-4 h-24 w-24 rounded-full border border-slate-200 object-cover"
              />
            ) : null}
            {isAdmin ? (
              <a href="/admin" className="mt-4 inline-flex text-sm font-semibold text-[color:var(--blue)]">Open Admin Panel</a>
            ) : null}
            <div className="mt-5">
              <LogoutButton />
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-[color:var(--navy)]">Profile Details</h2>
            <form action={updateProfile} encType="multipart/form-data" className="mt-4 space-y-3">
              <div>
                <label className="text-sm font-semibold text-slate-700">Name</label>
                <input name="name" defaultValue={user.name ?? ''} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Phone</label>
                <input name="phone" defaultValue={user.phone ?? ''} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
              </div>
              <div>
                <input type="hidden" name="currentPhotoUrl" value={user.photoUrl ?? ''} />
                <label className="text-sm font-semibold text-slate-700">Profile Photo</label>
                <input
                  name="photoFile"
                  type="file"
                  accept="image/*"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                />
                <p className="mt-1 text-xs text-slate-500">JPG, PNG, WebP, GIF, AVIF up to 5MB.</p>
                {user.photoUrl ? (
                  <label className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" name="removePhoto" />
                    Remove current photo
                  </label>
                ) : null}
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Bio</label>
                <textarea name="bio" defaultValue={user.bio ?? ''} rows={3} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="button-primary">Save Profile</button>
                <button type="reset" className="button-outline">Reset</button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-6 card p-6">
          <h2 className="text-lg font-semibold text-[color:var(--navy)]">Change Password</h2>
          <form action={changePassword} className="mt-4 grid gap-3 md:grid-cols-3">
            <div>
              <label className="text-sm font-semibold text-slate-700">Current Password</label>
              <input name="currentPassword" type="password" required className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">New Password</label>
              <input name="newPassword" type="password" required className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Confirm New Password</label>
              <input name="confirmPassword" type="password" required className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
            </div>
            <div className="md:col-span-3">
              <button type="submit" className="button-primary">Update Password</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
