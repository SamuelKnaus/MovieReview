import React from 'react';
import { Container, Table } from 'react-bootstrap';
import HeaderComponent from './HeaderComponent';
import { Movie } from '../models/Movie';
import { Collection } from '../models/Collection';
import Fetch from '../helper/Fetch';
import { HttpError } from '../models/HttpError';

type MovieListComponentProps = {
  allMoviesUrl: string
  allUsersUrl: string
  allCategoriesUrl: string
}

import './MovieListComponent.scss';

type MovieListComponentState = {
  error: boolean,
  isLoaded: boolean,
  movies: Movie[]
}

export default class MovieListComponent
  extends React.PureComponent<MovieListComponentProps, MovieListComponentState> {
  constructor(props: MovieListComponentProps) {
    super(props);
    this.state = {
      error: false,
      isLoaded: false,
      movies: [],
    };
  }

  componentDidUpdate(prevProps: MovieListComponentProps) {
    if (prevProps.allMoviesUrl !== this.props.allMoviesUrl) {
      Fetch.getMovieList(
        this.props.allMoviesUrl,
        this.requestResponseHandler,
        this.requestErrorHandler,
      );
    }
    return null;
  }

  requestResponseHandler = (serverResponse: Collection<Movie>) => {
    console.log(serverResponse);
    this.setState({
      isLoaded: true,
      movies: serverResponse.items ?? [],
    });
  };

  requestErrorHandler = (serverResponse: HttpError) => {
    this.setState({
      isLoaded: true,
    });
  };

  render() {
    let content;

    if (this.state.error) {
      content = (
        <div>
          Error
        </div>
      );
    } else if (!this.state.isLoaded) {
      content = (
        <div>
          Loading...
        </div>
      );
    } else {
      content = (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Director</th>
              <th>Length</th>
              <th>Category</th>
              <th>Release Date</th>
            </tr>
          </thead>
          <tbody>
            {this.state.movies.map((movie, index) => (
              <tr className="movie-list-item">
                <td>{index + 1}</td>
                <td>{movie.title}</td>
                <td>{movie.director}</td>
                <td>{movie.length}</td>
                <td>{movie.category_id}</td>
                <td>{movie.release_date}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    }
    return (
      <div className="movie-list">
        <HeaderComponent pageTitle="Movie List" />
        <div className="main">
          <div className="movie-list-table">
            <Container>
              {content}
            </Container>
          </div>
        </div>
      </div>
    );
  }
}
