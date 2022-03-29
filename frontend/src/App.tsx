import React from 'react';
import './App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Container } from 'react-bootstrap';
import Movie from './components/MovieItemComponent';
import MovieListComponent from './components/MovieListComponent';

export default class App extends React.PureComponent {
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
