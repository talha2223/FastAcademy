import { v2 as cloudinary } from 'cloudinary';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif'
]);

const EXTENSION_BY_TYPE: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif'
};

const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudinaryCloudName && cloudinaryApiKey && cloudinaryApiSecret) {
  cloudinary.config({
    cloud_name: cloudinaryCloudName,
    api_key: cloudinaryApiKey,
    api_secret: cloudinaryApiSecret,
    secure: true
  });
}

function sanitizeName(name: string) {
  const base = name
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return base || 'image';
}

function sanitizeFolder(folder: string) {
  const cleaned = folder.toLowerCase().replace(/[^a-z0-9-_]/g, '');
  return cleaned || 'general';
}

function extensionForFile(file: File) {
  if (EXTENSION_BY_TYPE[file.type]) {
    return EXTENSION_BY_TYPE[file.type];
  }
  const fromName = path.extname(file.name).toLowerCase();
  return fromName || '.jpg';
}

function asFile(value: FormDataEntryValue | null) {
  if (!value || typeof value === 'string') {
    return null;
  }
  if (value.size <= 0) {
    return null;
  }
  return value;
}

export async function storeUploadedImage(file: File, folder: string) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return null;
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return null;
  }

  const safeFolder = sanitizeFolder(folder);
  const filename = `${Date.now()}-${randomUUID()}-${sanitizeName(file.name)}${extensionForFile(file)}`;

  if (cloudinaryCloudName && cloudinaryApiKey && cloudinaryApiSecret) {
    try {
      const bytes = Buffer.from(await file.arrayBuffer());
      const base64 = bytes.toString('base64');
      const upload = await cloudinary.uploader.upload(`data:${file.type};base64,${base64}`, {
        folder: `academy/${safeFolder}`,
        public_id: filename.replace(/\.[^.]+$/, ''),
        resource_type: 'image'
      });
      return upload.secure_url;
    } catch {
      return null;
    }
  }

  // Firebase App Hosting runs on Cloud Run and its filesystem is not persistent.
  if (process.env.K_SERVICE) {
    return null;
  }

  try {
    const dir = path.join(process.cwd(), 'public', 'uploads', safeFolder);
    await mkdir(dir, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, filename), bytes);
    return `/uploads/${safeFolder}/${filename}`;
  } catch {
    return null;
  }
}

interface ResolveUploadArgs {
  formData: FormData;
  fileField: string;
  currentUrlField: string;
  removeField: string;
  folder: string;
}

export async function resolveUploadedImageUrl({
  formData,
  fileField,
  currentUrlField,
  removeField,
  folder
}: ResolveUploadArgs) {
  const existingUrl = String(formData.get(currentUrlField) ?? '').trim();
  const shouldRemove = formData.get(removeField) === 'on';
  const file = asFile(formData.get(fileField));

  if (file) {
    const uploaded = await storeUploadedImage(file, folder);
    if (uploaded) {
      return uploaded;
    }
  }

  if (shouldRemove) {
    return null;
  }

  return existingUrl || null;
}
