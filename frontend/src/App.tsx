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
  SET_CURRENT_USER_URL, SET_LOGIN_URL,
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

    const loginUrl = serverResponse['@controls']['moviereviewmeta:login']?.href;
    const currentUserUrl = serverResponse['@controls']['moviereviewmeta:current-user']?.href;

    this.props.appStateDispatch({ type: SET_ALL_MOVIES_URL, value: allMoviesUrl });
    this.props.appStateDispatch({ type: SET_ALL_USERS_URL, value: allUsersUrl });
    this.props.appStateDispatch({ type: SET_ALL_CATEGORIES_URL, value: allCategoriesUrl });
    this.props.appStateDispatch({ type: SET_ADD_MOVIE_URL, value: addMovieUrl });
    this.props.appStateDispatch({ type: SET_ADD_USER_URL, value: addUserUrl });
    this.props.appStateDispatch({ type: SET_ADD_CATEGORY_URL, value: addCategoryUrl });
    this.props.appStateDispatch({ type: SET_LOGIN_URL, value: loginUrl });
    this.props.appStateDispatch({ type: SET_CURRENT_USER_URL, value: currentUserUrl });
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
