// utils/expiringLocalStorage.js

export function setWithExpiry(key, value, ttlMs) {
  const now = Date.now();
  const item = {
    value,
    expiry: now + ttlMs,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

export function getWithExpiry(key) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  try {
    const item = JSON.parse(itemStr);
    if (Date.now() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  } catch (e) {
    console.error("Invalid item in localStorage", e);
    localStorage.removeItem(key);
    return null;
  }
}
