import { clsx, type ClassValue } from 'clsx';
import { format, isSameYear } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPreselectedValue(selectedDate: Date): string {
  const diff = Math.ceil((selectedDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === 3) return 'In 3 days';
  if (diff === 7) return 'In a week';
  return 'Select a date';
}

export function formatDate(date: Date): string {
  return format(date, isSameYear(date, new Date()) ? 'EEE d MMM' : 'EEE, d MMM yyyy');
}
