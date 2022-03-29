import React from 'react';
import './App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Container } from 'react-bootstrap';
import Movie from './components/MovieItemComponent';
import MovieListComponent from './components/MovieListComponent';
import Start from './components/Start';
import Movie from './components/Movie';
import Fetch, { ServerResponse } from './helper/Fetch';

export default class App extends React.PureComponent {
  componentDidMount() {
    Fetch.getBasicUrls(this.requestSuccessful, this.requestError);
  }

  requestSuccessful = (serverResponse: ServerResponse<any>) => {
    console.log(serverResponse);
  };

  requestError = (serverResponse: ServerResponse<any>) => {
    console.log(serverResponse);
  };

  render() {
    return (
      <Container>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<MovieListComponent />}
            />
            <Route
              path="/movie/:movieId"
              element={<Movie />}
            />
          </Routes>
        </BrowserRouter>
      </Container>
    );
  }
}
