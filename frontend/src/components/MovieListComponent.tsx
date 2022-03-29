import React from 'react';
import { Container } from 'react-bootstrap';
import HeaderComponent from './HeaderComponent';
import { Movie } from '../models/Movie';
import Fetch, { ServerResponse } from '../helper/Fetch';

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

  requestResponseHandler = (serverResponse: ServerResponse<Movie[]>) => {
    console.log(serverResponse.payload);
    this.setState({
      isLoaded: true,
      movies: serverResponse.payload ?? [],
    });
  };

  requestErrorHandler = (serverResponse: ServerResponse<any>) => {
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
        <ul>
          {this.state.movies.map((movie) => (
            <li>
              Hallo
            </li>
          ))}
        </ul>
      );
    }
    return (
      <Container>
        <HeaderComponent pageTitle="Movie List" />
        {content}
      </Container>
    );
  }
}
