import React from 'react';
import { Container, Table } from 'react-bootstrap';
import HeaderComponent from './HeaderComponent';
import { Movie } from '../models/Movie';
import { Collection } from '../models/Collection';
import Fetch from '../helper/Fetch';
import { HttpError } from '../models/HttpError';

type MovieListComponentState = {
  error: boolean,
  isLoaded: boolean,
  movies: Movie[]
}

export default class MovieListComponent extends React.PureComponent<any, MovieListComponentState> {
  constructor(props: any) {
    super(props);
    this.state = {
      error: false,
      isLoaded: false,
      movies: [],
    };
  }

  componentDidMount() {
    Fetch.getMovieList(this.requestResponseHandler, this.requestErrorHandler);
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
        <Table striped bordered hover className="movie-list-table">
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
          <Container>
            {content}
          </Container>
        </div>
      </div>
    );
  }
}
