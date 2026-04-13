export const getRandomId = (): string => crypto.randomUUID();

export const safeStringify = (value: unknown): string => {
  try {
    return JSON.stringify(value);
  } catch {
    return '[unserializable]';
  }
};
