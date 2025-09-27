// src/auth.js
export const fakeAuth = {
  isAuthenticated: false,
  login(username, password, callback) {
    if (username === "admin" && password === "password") {
      this.isAuthenticated = true;
      callback(true);
    } else {
      callback(false);
    }
  },
  logout(callback) {
    this.isAuthenticated = false;
    callback();
  }
};
