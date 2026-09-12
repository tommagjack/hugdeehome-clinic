// Authentication service for HugDeeHome Admin
// Prepared for seamless transition to Supabase / OAuth / JWT in production

const SESSION_KEY = 'hugdee_admin_session_v2';

export const authService = {
  login(username, password) {
    // Development prototype credentials
    // Note: In production, this calls a secure backend endpoint or Supabase Auth
    if (username === 'admin' && password === 'admin') {
      const session = {
        user: {
          username: 'admin',
          role: 'admin',
          displayName: 'ผู้ดูแลระบบบ้านฮักดี'
        },
        token: `mock_jwt_${Date.now()}`,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return { success: true, session };
    }
    return { success: false, error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
  },

  getCurrentUser() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw);
      if (session.expiresAt && Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }
      return session.user;
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  }
};
