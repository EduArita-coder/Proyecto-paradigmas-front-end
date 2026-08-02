export function getSessionId(): string {
  const key = "sessionId";
  const existing = localStorage.getItem(key);
  if (existing) {
    return existing;
  }

  let uuid: string;
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    uuid = crypto.randomUUID();
  } else {
    uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  localStorage.setItem(key, uuid);
  return uuid;
}
