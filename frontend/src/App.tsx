import React from 'react';
import './App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MovieListComponent from './components/MovieListComponent';
import Fetch from './helper/Fetch';
import MovieDetailComponent from './components/MovieDetailComponent';
import { MasonDoc } from './models/MasonDoc';

type AppState = {
  allMoviesUrl: string
  allUsersUrl: string
  allCategoriesUrl: string
}

export default class App extends React.PureComponent<any, AppState> {
  constructor(props: any) {
    super(props);

    this.state = {
      allMoviesUrl: '',
      allUsersUrl: '',
      allCategoriesUrl: '',
    };
  }

  componentDidMount() {
    Fetch.getBasicUrls(this.requestSuccessful, this.requestError);
  }

  requestSuccessful = (serverResponse: MasonDoc) => {
    this.setState({
      allMoviesUrl: serverResponse['@controls']['moviereviewmeta:movies-all']?.href ?? '',
      allUsersUrl: serverResponse['@controls']['moviereviewmeta:users-all']?.href ?? '',
      allCategoriesUrl: serverResponse['@controls']['moviereviewmeta:categories-all']?.href ?? '',
    });
    console.log(serverResponse['@controls']);
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
            element={(
              <MovieListComponent
                allMoviesUrl={this.state.allMoviesUrl}
                allUsersUrl={this.state.allUsersUrl}
                allCategoriesUrl={this.state.allCategoriesUrl}
              />
            )}
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
