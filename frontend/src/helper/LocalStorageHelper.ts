import { User } from '../models/User';

const CURRENT_USER_KEY = 'CURRENT_USER_KEY';
const AUTHENTICATION_TOKEN_KEY = 'AUTHENTICATION_TOKEN_KEY';

/*
  This class is used to store and retrieve data in the local storage of the browser
*/
export default class LocalStorageHelper {
  /**
   * Sets the current user in the local storage
   * @param user The user object
   */
  static setCurrentUser(user: User) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  /**
  * Deletes the current user from the local storage
  */
  static deleteCurrentUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  /**
  * Returns the current user from the local storage
  * @returns The user object or undefined if it doesn't exist in the local storage
  */
  static getCurrentUser(): User|undefined {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      return JSON.parse(storedUser) ?? undefined;
    }
    return undefined;
  }

  /**
  * Sets the authentication token in the local storage
  * @param token The token as string
  */
  static setAuthenticationToken(token: string) {
    localStorage.setItem(AUTHENTICATION_TOKEN_KEY, token);
  }

  /**
  * Deletes the authentication token from the local storage
  */
  static deleteAuthenticationToken() {
    localStorage.removeItem(AUTHENTICATION_TOKEN_KEY);
  }

  /**
  * Returns the authentication token from the local storage
  * @returns The token as string or undefined if it doesn't exist in the local storage
  */
  static getAuthenticationToken(): string|undefined {
    return localStorage.getItem(AUTHENTICATION_TOKEN_KEY) ?? undefined;
  }
}
