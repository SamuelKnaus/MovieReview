import React, { PureComponent } from 'react';
import { Container } from 'react-bootstrap';
import withRouter from '../helper/RouterHelper';
import HeaderComponent from './HeaderComponent';

import './MovieDetailComponent.scss';

type MovieProps = {
  params: {
    movieId: number
  }
}

class MovieDetailComponent extends PureComponent <MovieProps> {
  render() {
    return (
      <div className="movie-item">
        <HeaderComponent pageTitle="Movie Title" />
        <div className="main">
          <div className="move-item-card">
            <Container>
              <h3>Information</h3>
              {this.props.params.movieId}
              <ul>
                <li>Director: abc</li>
                <li>Length: 123</li>
                <li>Release Date: 01.02.1998</li>
                <li>Category: Crime</li>
              </ul>
            </Container>
          </div>

          <div className="reviews">
            <Container>
              <h3>Reviews</h3>
            </Container>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(MovieDetailComponent);
