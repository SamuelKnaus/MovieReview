import React from 'react';
import './App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Start from './components/Start';
import Movie from './components/Movie';

export default class App extends React.PureComponent {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Start />}
          />
          <Route
            path="/movie/:movieId"
            element={<Movie />}
          />
        </Routes>
      </BrowserRouter>
    );
  }
}
