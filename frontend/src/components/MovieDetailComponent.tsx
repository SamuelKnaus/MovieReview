import React, { PureComponent } from 'react';
import withRouter from '../helper/RouterHelper';
import HeaderComponent from './HeaderComponent';
import MovieDetailInformationComponent from './MovieDetailInformationComponent';
import MovieDetailReviewsComponent from './MovieDetailReviewsComponent';
import FooterComponent from './FooterComponent';

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
          <MovieDetailInformationComponent />
          <MovieDetailReviewsComponent />
        </div>
        <FooterComponent />
      </div>
    );
  }
}

export default withRouter(MovieDetailComponent);
