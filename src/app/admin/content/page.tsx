import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { resolveUploadedImageUrl } from '@/lib/image-upload';

async function createPost(formData: FormData) {
  'use server';
  await requireAdmin();

  const title = String(formData.get('title') ?? '').trim();
  const type = String(formData.get('type') ?? 'POST');
  const excerpt = String(formData.get('excerpt') ?? '').trim();
  const contentMd = String(formData.get('contentMd') ?? '').trim();
  const coverImageUrl = await resolveUploadedImageUrl({
    formData,
    fileField: 'coverImageFile',
    currentUrlField: 'currentCoverImageUrl',
    removeField: 'removeCoverImage',
    folder: 'posts'
  });
  const published = formData.get('published') === 'on';
  const pinned = formData.get('pinned') === 'on';

  if (!title || !excerpt || !contentMd) {
    return;
  }

  const baseSlug = slugify(title) || `post-${Date.now()}`;
  let slug = baseSlug;
  let i = 1;
  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i++}`;
  }

  await prisma.post.create({
    data: {
      title,
      type: type as any,
      slug,
      excerpt,
      contentMd,
      coverImageUrl,
      published,
      pinned
    }
  });

  revalidatePath('/admin/content');
  revalidatePath('/');
  revalidatePath('/announcements');
  revalidatePath('/news');
  revalidatePath('/posts');
}

async function updatePost(formData: FormData) {
  'use server';
  await requireAdmin();

  const id = String(formData.get('id') ?? '');
  const title = String(formData.get('title') ?? '').trim();
  const type = String(formData.get('type') ?? 'POST');
  const excerpt = String(formData.get('excerpt') ?? '').trim();
  const contentMd = String(formData.get('contentMd') ?? '').trim();
  const coverImageUrl = await resolveUploadedImageUrl({
    formData,
    fileField: 'coverImageFile',
    currentUrlField: 'currentCoverImageUrl',
    removeField: 'removeCoverImage',
    folder: 'posts'
  });
  const published = formData.get('published') === 'on';
  const pinned = formData.get('pinned') === 'on';
  const slugInput = String(formData.get('slug') ?? '').trim();

  if (!id || !title || !excerpt || !contentMd) {
    return;
  }

  let slug = slugify(slugInput || title) || `post-${Date.now()}`;
  const existing = await prisma.post.findUnique({ where: { slug } });
  if (existing && existing.id !== id) {
    slug = `${slug}-${Date.now()}`;
  }

  await prisma.post.update({
    where: { id },
    data: {
      title,
      type: type as any,
      slug,
      excerpt,
      contentMd,
      coverImageUrl,
      published,
      pinned
    }
  });

  revalidatePath('/admin/content');
  revalidatePath('/');
  revalidatePath('/announcements');
  revalidatePath('/news');
  revalidatePath('/posts');
}

async function deletePost(formData: FormData) {
  'use server';
  await requireAdmin();

  const id = String(formData.get('id') ?? '');
  if (!id) {
    return;
  }

  await prisma.post.delete({ where: { id } });
  revalidatePath('/admin/content');
  revalidatePath('/');
  revalidatePath('/announcements');
  revalidatePath('/news');
  revalidatePath('/posts');
}

export default async function AdminContentPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="grid gap-8">
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-[color:var(--navy)]">Create New Item</h2>
        <form action={createPost} encType="multipart/form-data" className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Title</label>
            <input name="title" required className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Type</label>
            <select name="type" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2">
              <option value="ANNOUNCEMENT">Announcement</option>
              <option value="NEWS">News</option>
              <option value="POST">Post</option>
            </select>
          </div>
          <div>
            <input type="hidden" name="currentCoverImageUrl" value="" />
            <label className="text-sm font-semibold text-slate-700">Cover Image Upload</label>
            <input
              name="coverImageFile"
              type="file"
              accept="image/*"
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
            />
            <p className="mt-1 text-xs text-slate-500">JPG, PNG, WebP, GIF, AVIF up to 5MB.</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Excerpt</label>
            <textarea name="excerpt" required className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" rows={2} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Content (Markdown)</label>
            <textarea name="contentMd" required className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" rows={6} />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" name="published" defaultChecked /> Published
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" name="pinned" /> Pinned
            </label>
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="button-primary">Create</button>
          </div>
        </form>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <div key={post.id} className="card p-6">
            <form action={updatePost} encType="multipart/form-data" className="grid gap-4">
              <input type="hidden" name="id" value={post.id} />
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Title</label>
                  <input name="title" defaultValue={post.title} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Slug</label>
                  <input name="slug" defaultValue={post.slug} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Type</label>
                  <select name="type" defaultValue={post.type} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2">
                    <option value="ANNOUNCEMENT">Announcement</option>
                    <option value="NEWS">News</option>
                    <option value="POST">Post</option>
                  </select>
                </div>
                <div>
                  <input type="hidden" name="currentCoverImageUrl" value={post.coverImageUrl ?? ''} />
                  <label className="text-sm font-semibold text-slate-700">Cover Image Upload</label>
                  <input
                    name="coverImageFile"
                    type="file"
                    accept="image/*"
                    className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                  />
                  <p className="mt-1 text-xs text-slate-500">Leave empty to keep existing image.</p>
                  {post.coverImageUrl ? (
                    <label className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                      <input type="checkbox" name="removeCoverImage" />
                      Remove current cover image
                    </label>
                  ) : null}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Excerpt</label>
                <textarea name="excerpt" defaultValue={post.excerpt} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" rows={2} />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Content (Markdown)</label>
                <textarea name="contentMd" defaultValue={post.contentMd} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" rows={6} />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" name="published" defaultChecked={post.published} /> Published
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" name="pinned" defaultChecked={post.pinned} /> Pinned
                </label>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="submit" className="button-primary">Save</button>
              </div>
            </form>
            <form action={deletePost} className="mt-3">
              <input type="hidden" name="id" value={post.id} />
              <button type="submit" className="button-outline">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
