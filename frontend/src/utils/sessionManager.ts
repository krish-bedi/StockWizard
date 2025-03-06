import { clearCredentials } from '../redux/slices/authSlice';
import { store } from '../store';

/*
 * SessionManager: Handles frontend session timing and cleanup
 * Singleton class: Ensures we don't have multiple timers running
 * 
 * 1. Tracks the access token expiration (15 min)
 * 2. Automatically logs out user when session expires
 */

class SessionManager {
  // Holds the timeout that will trigger logout
  private timeoutId: NodeJS.Timeout | null = null;

  // Singleton instance
  private static instance: SessionManager;
  private constructor() {}

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  // Starts a new timer for the session
  startSessionTimer(expiresIn: number) {
    this.clearSessionTimer();
    this.timeoutId = setTimeout(() => {
      store.dispatch(clearCredentials());
    }, expiresIn);
  }

  // Clears the timer
  clearSessionTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

// Export a single instance of the class
export const sessionManager = SessionManager.getInstance(); 