import { createStore } from 'redux';
import appReducer from './Reducer';

export interface AppState {
  allMoviesUrl?: string
  allUsersUrl?: string
  allCategoriesUrl?: string
  addMovieUrl?: string
  addUserUrl?: string
  addCategoryUrl?: string
}

const store = createStore(appReducer);
export default store;
