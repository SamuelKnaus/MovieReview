import React, { PureComponent } from 'react';
import { Container } from 'react-bootstrap';
import withRouter from '../helper/RouterHelper';
import HeaderComponent from './HeaderComponent';

type MovieProps = {
  params: {
    movieId: number
  }
}

class MovieItemComponent extends PureComponent <MovieProps> {
  render() {
    return (
      <div className="movie-item">
        <HeaderComponent pageTitle="Movie Item" />
        <div className="main">
          <Container>
            {this.props.params.movieId}
          </Container>
        </div>
      </div>
    );
  }
}

export default withRouter(MovieItemComponent);
