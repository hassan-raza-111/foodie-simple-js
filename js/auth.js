const Auth = {
  _currentUser: null,
  _loaded: false,

  async _fetchSession() {
    if (this._loaded) return;
    try {
      const res = await fetch('php/session.php');
      const data = await res.json();
      if (data.loggedIn) {
        this._currentUser = data.user;
      } else {
        this._currentUser = null;
      }
    } catch {
      this._currentUser = null;
    }
    this._loaded = true;
  },

  getCurrentUser() {
    return this._currentUser;
  },

  isLoggedIn() {
    return this._currentUser !== null;
  },

  async checkSession() {
    await this._fetchSession();
    return this._currentUser;
  },

  async signup(name, email, password) {
    try {
      const res = await fetch('php/signup.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (data.success) {
        this._currentUser = data.user;
        this._loaded = true;
      }
      return data;
    } catch {
      return { success: false, message: 'Network error. Please try again.' };
    }
  },

  async signin(email, password) {
    try {
      const res = await fetch('php/signin.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        this._currentUser = data.user;
        this._loaded = true;
      }
      return data;
    } catch {
      return { success: false, message: 'Network error. Please try again.' };
    }
  },

  async signout() {
    try {
      await fetch('php/logout.php');
    } catch {}
    this._currentUser = null;
    this._loaded = false;
  }
};
