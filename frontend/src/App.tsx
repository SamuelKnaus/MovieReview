import React from 'react';
import './App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MovieListComponent from './components/MovieListComponent';
import Fetch from './helper/Fetch';
import MovieDetailComponent from './components/MovieDetailComponent';
import { MasonDoc } from './models/MasonDoc';

export default class App extends React.PureComponent {
  componentDidMount() {
    Fetch.getBasicUrls(this.requestSuccessful, this.requestError);
  }

  requestSuccessful = (serverResponse: MasonDoc) => {
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
