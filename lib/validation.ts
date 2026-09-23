export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isNik(value: string) {
  return /^\d{16}$/.test(value);
}

export function isPhone(value: string) {
  return /^08\d{8,11}$/.test(value);
}

export function validDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime());
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}