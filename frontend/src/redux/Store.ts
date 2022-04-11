import { createStore } from 'redux';
import { User } from '../models/User';
import appReducer from './Reducer';

export interface AppState {
  allMoviesUrl?: string
  allUsersUrl?: string
  allCategoriesUrl?: string
  addMovieUrl?: string
  addUserUrl?: string
  addCategoryUrl?: string
  loginUrl?: string
  currentUserUrl?: string
  authenticationToken?: string
  currentUser?: User
}

const store = createStore(appReducer);
export default store;
