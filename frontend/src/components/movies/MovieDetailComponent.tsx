import React, { PureComponent } from 'react';
import { Spinner } from 'react-bootstrap';
import withRouter from '../../helper/RouterHelper';
import HeaderComponent from '../header_footer/HeaderComponent';
import MovieDetailInformationComponent from './MovieDetailInformationComponent';
import MovieDetailReviewsComponent from './MovieDetailReviewsComponent';
import FooterComponent from '../header_footer/FooterComponent';
import { Movie } from '../../models/Movie';
import Fetch from '../../helper/Fetch';
import { HttpError } from '../../models/HttpError';

import './MovieDetailComponent.scss';

type MovieDetailComponentProps = {
  location: {
    state: {
      movieRequestUrl: string
      categoryTitle: string
    }
  }
}

interface MovieDetailComponentState {
  movie?: Movie
  isLoaded: boolean,
}

class MovieDetailComponent
  extends PureComponent <MovieDetailComponentProps, MovieDetailComponentState> {
  constructor(props: MovieDetailComponentProps) {
    super(props);

    this.state = {
      isLoaded: false,
    };
  }

  componentDidMount() {
    this.fetchMovie();
  }

  requestResponseHandler = (serverResponse: Movie) => {
    this.setState({
      movie: serverResponse ?? [],
      isLoaded: true,
    });
  };

  requestErrorHandler = () => {
    this.setState({
      isLoaded: true,
    });
  };

  fetchMovie() {
    Fetch.getRequest(
      this.props.location.state.movieRequestUrl,
      this.requestResponseHandler,
      this.requestErrorHandler,
    );
  }

  render() {
    return (
      <div className="movie-item">
        <HeaderComponent pageTitle={this.state.movie?.title ?? 'Movie Item'} />
        {!this.state.isLoaded && (
          <div className="single-movie-loading-spinner">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
        {this.state.isLoaded && !this.state.movie && (
          <div
            className="single-movie-loading-failed"
          >
            Could not be loaded
          </div>
        )}
        {this.state.isLoaded && this.state.movie && (
          <div className="main">
            <MovieDetailInformationComponent
              movie={this.state.movie}
              categoryTitle={this.props.location.state.categoryTitle}
            />
            <MovieDetailReviewsComponent
              movie={this.state.movie}
              reviewsUrl={this.state.movie?.['@controls']['moviereviewmeta:reviews-for-movie']?.href}
            />
          </div>
        )}
        <FooterComponent />
      </div>
    );
  }
}

export default withRouter(MovieDetailComponent);
