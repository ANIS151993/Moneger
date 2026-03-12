const SIDEBAR_STORAGE_KEY = "moneger:sidebar-open";

export function readSidebarPreference() {
  if (typeof window === "undefined") {
    return true;
  }

  const value = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
  return value ? value === "true" : true;
}

export function writeSidebarPreference(value: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(value));
}
