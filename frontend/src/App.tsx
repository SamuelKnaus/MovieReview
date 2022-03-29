import React from 'react';
import './App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MovieItemComponent from './components/MovieItemComponent';
import MovieListComponent from './components/MovieListComponent';
import Fetch from './helper/Fetch';

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
            element={<MovieItemComponent />}
          />
        </Routes>
      </BrowserRouter>
    );
  }
}
