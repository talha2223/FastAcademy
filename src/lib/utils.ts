export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

export function whatsappLink(phone: string) {
  const digits = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${digits}`;
}
