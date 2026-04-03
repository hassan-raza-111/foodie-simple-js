const Auth = {
  USERS_KEY: 'foodie_users',
  CURRENT_USER_KEY: 'foodie_current_user',

  getUsers() {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
  },

  saveUsers(users) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  },

  getCurrentUser() {
    const data = localStorage.getItem(this.CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser(user) {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  },

  signup(name, email, password) {
    const users = this.getUsers();
    const emailLower = email.toLowerCase().trim();

    if (users.find(u => u.email === emailLower)) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      id: 'user_' + Date.now(),
      name: name.trim(),
      email: emailLower,
      password: password,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);

    const safeUser = { id: newUser.id, name: newUser.name, email: newUser.email };
    this.setCurrentUser(safeUser);
    return { success: true, user: safeUser };
  },

  signin(email, password) {
    const users = this.getUsers();
    const emailLower = email.toLowerCase().trim();
    const user = users.find(u => u.email === emailLower && u.password === password);

    if (!user) {
      return { success: false, message: 'Invalid email or password.' };
    }

    const safeUser = { id: user.id, name: user.name, email: user.email };
    this.setCurrentUser(safeUser);
    return { success: true, user: safeUser };
  },

  signout() {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  },

  isLoggedIn() {
    return this.getCurrentUser() !== null;
  }
};

