import { AppState } from './Store';

export type SetUrlAction = {
  type: string,
  url: string
}

export const SET_ALL_MOVIES_URL = 'SET_ALL_MOVIES_URL';
export const SET_ALL_CATEGORIES_URL = 'SET_ALL_CATEGORIES_URL';
export const SET_ALL_USERS_URL = 'SET_ALL_USERS_URL';
export const SET_ADD_MOVIE_URL = 'SET_ADD_MOVIE_URL';
export const SET_ADD_CATEGORY_URL = 'SET_ADD_CATEGORY_URL';
export const SET_ADD_USER_URL = 'SET_ADD_USER_URL';

// eslint-disable-next-line default-param-last
export default function appReducer(state: AppState = {}, action: SetUrlAction): AppState {
  switch (action.type) {
    case SET_ALL_MOVIES_URL:
      return {
        ...state,
        allMoviesUrl: action.url,
      };
    case SET_ALL_USERS_URL:
      return {
        ...state,
        allUsersUrl: action.url,
      };
    case SET_ALL_CATEGORIES_URL:
      return {
        ...state,
        allCategoriesUrl: action.url,
      };
    case SET_ADD_MOVIE_URL:
      return {
        ...state,
        addMovieUrl: action.url,
      };
    case SET_ADD_CATEGORY_URL:
      return {
        ...state,
        addCategoryUrl: action.url,
      };
    case SET_ADD_USER_URL:
      return {
        ...state,
        addUserUrl: action.url,
      };
    default:
      return state;
  }
}
