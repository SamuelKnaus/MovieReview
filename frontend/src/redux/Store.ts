import { createStore } from 'redux';
import appReducer from './Reducer';

export interface AppState {
  allMoviesUrl?: string
  allUsersUrl?: string
  allCategoriesUrl?: string
}

const store = createStore(appReducer);
export default store;
