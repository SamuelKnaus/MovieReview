import { AppState } from './Store';

export type SetValueAction = {
  type: string,
  value: string
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

// eslint-disable-next-line default-param-last
export default function appReducer(state: AppState = { authenticationToken: '' }, action: SetValueAction): AppState {
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
      return {
        ...state,
        authenticationToken: action.value,
      };
    default:
      return state;
  }
}
