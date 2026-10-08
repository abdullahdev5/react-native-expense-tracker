

// safeString
export const toSafeString = (value: string | null | undefined): string => value ?? '';

// isNullOrEmpty
export const isNullOrEmpty = (value: string | null | undefined): boolean => {
    return (!value || value.trim() == '');
}

// isEmail
export const isEmail = (value: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value);
}

// capitalize
export const capitalize = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return value;

  return trimmed
    .toLowerCase()
    .split(/\s+/) // This handles multiple spaces/tabs correctly
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}