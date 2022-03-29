import React from 'react';
import { Container } from 'react-bootstrap';
import HeaderComponent from './HeaderComponent';
import { Movie } from '../models/Movie';
import { Collection } from '../models/Collection';
import Fetch from '../helper/Fetch';

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

  requestErrorHandler = (serverResponse: any) => {
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
            <li
              key={movie.id}
            >
              {movie.title}
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
