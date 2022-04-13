import { User } from '../models/User';

const CURRENT_USER_KEY = 'CURRENT_USER_KEY';
const AUTHENTICATION_TOKEN_KEY = 'AUTHENTICATION_TOKEN_KEY';

export default class LocalStorageHelper {
  static setCurrentUser(user: User) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  static deleteCurrentUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  static getCurrentUser(): User|undefined {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      return JSON.parse(storedUser) ?? undefined;
    }
    return undefined;
  }

  static setAuthenticationToken(token: string) {
    localStorage.setItem(AUTHENTICATION_TOKEN_KEY, token);
  }

  static deleteAuthenticationToken() {
    localStorage.removeItem(AUTHENTICATION_TOKEN_KEY);
  }

  static getAuthenticationToken(): string|undefined {
    return localStorage.getItem(AUTHENTICATION_TOKEN_KEY) ?? undefined;
  }
}
