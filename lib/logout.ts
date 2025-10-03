import { clearUserSession } from './auth-helpers';
import { useAuthStore, useAppStore } from './store';

/**
 * Clear local session, reset zustand stores and navigate to destination (defaults to '/').
 * This is safe to call from client code only.
 */
export function logoutAndRedirect(destination = '/') {
  try {
    if (typeof window === 'undefined') return;

    // Clear localStorage session key
    clearUserSession();

    // Clear zustand persisted auth and app stores if available
    try {
      const { clearAuth } = useAuthStore.getState();
      clearAuth && clearAuth();
    } catch (e) {
      // swallow - store may not be initialized in some contexts
      // but we attempt to clear it if possible
      // eslint-disable-next-line no-console
      console.warn('Could not clear auth store:', e);
    }

    try {
      useAppStore.getState().setUser && useAppStore.getState().setUser(null as any);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Could not clear app store user:', e);
    }

    // Use location.replace so the browser navigates directly to destination
    // without creating a new history entry and avoid reloading the previous page.
    // This is more reliable than setting href + reload which could re-load the current
    // page in some race conditions.
    try {
      window.location.replace(destination);
    } catch (e) {
      // Fallback
      window.location.href = destination;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('logoutAndRedirect error:', err);
  }
}
