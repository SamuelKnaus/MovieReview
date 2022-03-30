import React from 'react';
import './App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MovieListComponent from './components/MovieListComponent';
import Fetch from './helper/Fetch';
import MovieDetailComponent from './components/MovieDetailComponent';

export default class App extends React.PureComponent {
  componentDidMount() {
    Fetch.getBasicUrls(this.requestSuccessful, this.requestError);
  }

  requestSuccessful = (serverResponse: any) => {
    console.log(serverResponse);
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
            element={<MovieListComponent />}
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
