import React from 'react';
import './App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Container } from 'react-bootstrap';
import Movie from './components/Movie';
import StartComponent from './components/StartComponent';

export default class App extends React.PureComponent {
  render() {
    return (
      <Container>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<StartComponent />}
            />
            <Route
              path="/movie/:movie_id"
              element={<Movie />}
            />
          </Routes>
        </BrowserRouter>
      </Container>
    );
  }
}
