import React from 'react';
import { Container } from 'react-bootstrap';
import HeaderComponent from './HeaderComponent';
import { Movie } from '../models/Movie';

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
    fetch('http://127.0.0.1:5000/api/movies/')
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            movies: result.items,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        },
      );
  }

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
              {movie}
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
