import React, { PureComponent } from 'react';
import withRouter from '../helper/RouterHelper';

type MovieProps = {
  params: {
    movieId: number
  }
}

class MovieItemComponent extends PureComponent <MovieProps> {
  render() {
    return (
      <h1>
        Start
        {this.props.params.movieId}
      </h1>
    );
  }
}

export default withRouter(MovieItemComponent);
