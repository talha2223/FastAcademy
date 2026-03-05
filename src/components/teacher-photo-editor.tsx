'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState, type ChangeEvent } from 'react';

interface TeacherPhotoEditorProps {
  defaultPhotoUrl?: string | null;
  defaultZoom?: number | null;
  defaultX?: number | null;
  defaultY?: number | null;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function TeacherPhotoEditor({
  defaultPhotoUrl,
  defaultZoom,
  defaultX,
  defaultY
}: TeacherPhotoEditorProps) {
  const initialUrl = defaultPhotoUrl ?? '';
  const [previewUrl, setPreviewUrl] = useState(initialUrl);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [zoom, setZoom] = useState(clamp(defaultZoom ?? 1, 1, 3));
  const [x, setX] = useState(clamp(defaultX ?? 50, 0, 100));
  const [y, setY] = useState(clamp(defaultY ?? 50, 0, 100));

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl(null);
    }

    if (!file) {
      if (!removePhoto) {
        setPreviewUrl(initialUrl);
      }
      return;
    }

    const nextObjectUrl = URL.createObjectURL(file);
    setObjectUrl(nextObjectUrl);
    setPreviewUrl(nextObjectUrl);
    setRemovePhoto(false);
  }

  function handleRemoveChange(event: ChangeEvent<HTMLInputElement>) {
    const checked = event.target.checked;
    setRemovePhoto(checked);

    if (checked) {
      setPreviewUrl('');
      return;
    }

    if (objectUrl) {
      setPreviewUrl(objectUrl);
      return;
    }

    setPreviewUrl(initialUrl);
  }

  const previewStyle = useMemo(
    () => ({
      transform: `scale(${zoom})`,
      transformOrigin: `${x}% ${y}%`
    }),
    [zoom, x, y]
  );

  return (
    <div className="md:col-span-2 rounded-2xl border border-slate-200 p-4">
      <p className="text-sm font-semibold text-slate-700">Teacher Profile Photo (with zoom)</p>

      <div className="mt-3 grid gap-4 md:grid-cols-[1fr,180px]">
        <div className="space-y-3">
          <div>
            <input type="hidden" name="currentPhotoUrl" value={initialUrl} />
            <label className="text-sm font-semibold text-slate-700">Upload Photo</label>
            <input
              name="photoFile"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
            />
            <p className="mt-1 text-xs text-slate-500">JPG, PNG, WebP, GIF, AVIF up to 5MB.</p>
          </div>

          {initialUrl ? (
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                name="removePhoto"
                checked={removePhoto}
                onChange={handleRemoveChange}
              />
              Remove current photo
            </label>
          ) : null}

          <div>
            <label className="text-sm font-semibold text-slate-700">Zoom ({zoom.toFixed(2)}x)</label>
            <input
              name="photoZoom"
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="mt-2 w-full"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Horizontal Position ({x}%)</label>
            <input
              name="photoPositionX"
              type="range"
              min={0}
              max={100}
              step={1}
              value={x}
              onChange={(event) => setX(Number(event.target.value))}
              className="mt-2 w-full"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Vertical Position ({y}%)</label>
            <input
              name="photoPositionY"
              type="range"
              min={0}
              max={100}
              step={1}
              value={y}
              onChange={(event) => setY(Number(event.target.value))}
              className="mt-2 w-full"
            />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="h-40 w-40 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
            {previewUrl ? (
              <img src={previewUrl} alt="Teacher preview" className="h-full w-full object-cover" style={previewStyle} />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">No image</div>
            )}
          </div>
          <p className="mt-2 text-xs text-slate-500">Preview matches public profile photo crop.</p>
        </div>
      </div>
    </div>
  );
}
