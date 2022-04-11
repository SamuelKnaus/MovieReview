import { AppState } from './Store';

export type SetValueAction = {
  type: string,
  value: any
}

export const SET_ALL_MOVIES_URL = 'SET_ALL_MOVIES_URL';
export const SET_ALL_CATEGORIES_URL = 'SET_ALL_CATEGORIES_URL';
export const SET_ALL_USERS_URL = 'SET_ALL_USERS_URL';
export const SET_ADD_MOVIE_URL = 'SET_ADD_MOVIE_URL';
export const SET_ADD_CATEGORY_URL = 'SET_ADD_CATEGORY_URL';
export const SET_ADD_USER_URL = 'SET_ADD_USER_URL';
export const SET_LOGIN_URL = 'SET_LOGIN_URL';
export const SET_CURRENT_USER_URL = 'SET_CURRENT_USER_URL';
export const SET_AUTHENTICATION_TOKEN = 'SET_AUTHENTICATION_TOKEN';
export const DELETE_AUTHENTICATION_TOKEN = 'DELETE_AUTHENTICATION_TOKEN';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const DELETE_CURRENT_USER = 'DELETE_CURRENT_USER';

export default function appReducer(
  // eslint-disable-next-line default-param-last
  state: AppState = {
    authenticationToken: localStorage.getItem(SET_AUTHENTICATION_TOKEN) ?? undefined,
  },
  action: SetValueAction,
): AppState {
  switch (action.type) {
    case SET_ALL_MOVIES_URL:
      return {
        ...state,
        allMoviesUrl: action.value,
      };
    case SET_ALL_USERS_URL:
      return {
        ...state,
        allUsersUrl: action.value,
      };
    case SET_ALL_CATEGORIES_URL:
      return {
        ...state,
        allCategoriesUrl: action.value,
      };
    case SET_ADD_MOVIE_URL:
      return {
        ...state,
        addMovieUrl: action.value,
      };
    case SET_ADD_CATEGORY_URL:
      return {
        ...state,
        addCategoryUrl: action.value,
      };
    case SET_ADD_USER_URL:
      return {
        ...state,
        addUserUrl: action.value,
      };
    case SET_LOGIN_URL:
      return {
        ...state,
        loginUrl: action.value,
      };
    case SET_CURRENT_USER_URL:
      return {
        ...state,
        currentUserUrl: action.value,
      };
    case SET_AUTHENTICATION_TOKEN:
      localStorage.setItem(SET_AUTHENTICATION_TOKEN, action.value);
      return {
        ...state,
        authenticationToken: action.value,
      };
    case DELETE_AUTHENTICATION_TOKEN:
      localStorage.removeItem(SET_AUTHENTICATION_TOKEN);
      return {
        ...state,
        authenticationToken: undefined,
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.value,
      };
    case DELETE_CURRENT_USER:
      return {
        ...state,
        currentUser: undefined,
      };
    default:
      return state;
  }
}
