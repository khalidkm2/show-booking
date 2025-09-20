

export function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env variable ${key}`);
  return value;
}