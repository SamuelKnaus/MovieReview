import React, { PureComponent } from 'react';
import withRouter from '../helper/RouterHelper';

type MovieProps = {
  params: {
    movieId: number
  }
}

type MovieState = {
  movieId: number
}

class MovieComponent extends PureComponent <MovieProps, MovieState> {
  constructor(props: MovieProps) {
    super(props);

    this.state = {
      movieId: this.props.params.movieId,
    };
  }

  render() {
    return (
      <h1>
        Start
        {this.state.movieId}
      </h1>
    );
  }
}

export default withRouter(MovieComponent);
