import React from 'react';
import './App.scss';
import { unstable_HistoryRouter as HistoryRouter, Routes, Route } from 'react-router-dom';

import MovieListComponent from './components/MovieListComponent';
import Fetch from './helper/Fetch';
import MovieDetailComponent from './components/MovieDetailComponent';
import { MasonDoc } from './models/MasonDoc';
import withAppState from './helper/ReduxHelper';
import {
  SET_ADD_CATEGORY_URL, SET_ADD_MOVIE_URL, SET_ADD_USER_URL,
  SET_ALL_CATEGORIES_URL, SET_ALL_MOVIES_URL, SET_ALL_USERS_URL,
} from './redux/Reducer';
import LoginComponent from './components/LoginComponent';
import history from './helper/History';

class App extends React.PureComponent<any> {
  componentDidMount() {
    Fetch.getBasicUrls(this.requestSuccessful, this.requestError);
  }

  requestSuccessful = (serverResponse: MasonDoc) => {
    const allMoviesUrl = serverResponse['@controls']['moviereviewmeta:movies-all']?.href;
    const allUsersUrl = serverResponse['@controls']['moviereviewmeta:users-all']?.href;
    const allCategoriesUrl = serverResponse['@controls']['moviereviewmeta:categories-all']?.href;

    const addMovieUrl = serverResponse['@controls']['moviereviewmeta:add-movie']?.href;
    const addUserUrl = serverResponse['@controls']['moviereviewmeta:add-user']?.href;
    const addCategoryUrl = serverResponse['@controls']['moviereviewmeta:add-category']?.href;

    this.props.appStateDispatch({ type: SET_ALL_MOVIES_URL, url: allMoviesUrl });
    this.props.appStateDispatch({ type: SET_ALL_USERS_URL, url: allUsersUrl });
    this.props.appStateDispatch({ type: SET_ALL_CATEGORIES_URL, url: allCategoriesUrl });
    this.props.appStateDispatch({ type: SET_ADD_MOVIE_URL, url: addMovieUrl });
    this.props.appStateDispatch({ type: SET_ADD_USER_URL, url: addUserUrl });
    this.props.appStateDispatch({ type: SET_ADD_CATEGORY_URL, url: addCategoryUrl });
  };

  requestError = (serverResponse: any) => {
    console.log(serverResponse);
  };

  render() {
    return (
      <HistoryRouter history={history}>
        <Routes>
          <Route
            path="/"
            element={(<MovieListComponent />)}
          />
          <Route
            path="/login"
            element={<LoginComponent />}
          />
          <Route
            path="/movie/:movieId"
            element={<MovieDetailComponent />}
          />
        </Routes>
      </HistoryRouter>
    );
  }
}

export default withAppState(App);
