/* eslint-disable @next/next/no-img-element */
import React from 'react';

interface TeacherAvatarProps {
  name: string;
  photoUrl?: string | null;
  photoZoom?: number | null;
  photoPositionX?: number | null;
  photoPositionY?: number | null;
  className?: string;
  fallbackClassName?: string;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function initialsFromName(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function TeacherAvatar({
  name,
  photoUrl,
  photoZoom,
  photoPositionX,
  photoPositionY,
  className,
  fallbackClassName
}: TeacherAvatarProps) {
  const zoom = clamp(photoZoom ?? 1, 1, 3);
  const x = clamp(photoPositionX ?? 50, 0, 100);
  const y = clamp(photoPositionY ?? 50, 0, 100);

  if (!photoUrl) {
    return (
      <div className={fallbackClassName ?? className}>
        {initialsFromName(name)}
      </div>
    );
  }

  return (
    <div className={className}>
      <img
        src={photoUrl}
        alt={name}
        className="h-full w-full object-cover"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: `${x}% ${y}%`
        }}
      />
    </div>
  );
}
