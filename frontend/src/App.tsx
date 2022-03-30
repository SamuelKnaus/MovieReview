import React from 'react';
import './App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MovieListComponent from './components/MovieListComponent';
import Fetch from './helper/Fetch';
import MovieDetailComponent from './components/MovieDetailComponent';
import { MasonDoc } from './models/MasonDoc';
import withAppState from './helper/ReduxHelper';
import { SET_ALL_CATEGORIES_URL, SET_ALL_MOVIES_URL, SET_ALL_USERS_URL } from './redux/Reducer';

class App extends React.PureComponent<any> {
  componentDidMount() {
    Fetch.getBasicUrls(this.requestSuccessful, this.requestError);
  }

  requestSuccessful = (serverResponse: MasonDoc) => {
    const allMoviesUrl = serverResponse['@controls']['moviereviewmeta:movies-all']?.href ?? '';
    const allUsersUrl = serverResponse['@controls']['moviereviewmeta:users-all']?.href ?? '';
    const allCategoriesUrl = serverResponse['@controls']['moviereviewmeta:categories-all']?.href ?? '';

    this.props.appStateDispatch({ type: SET_ALL_MOVIES_URL, url: allMoviesUrl });
    this.props.appStateDispatch({ type: SET_ALL_USERS_URL, url: allUsersUrl });
    this.props.appStateDispatch({ type: SET_ALL_CATEGORIES_URL, url: allCategoriesUrl });
  };

  requestError = (serverResponse: any) => {
    console.log(serverResponse);
  };

  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={(<MovieListComponent />)}
          />
          <Route
            path="/movie/:movieId"
            element={<MovieDetailComponent />}
          />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default withAppState(App);
