import React, { PureComponent } from 'react';
import { Location } from 'react-router-dom';
import withRouter from '../helper/RouterHelper';
import HeaderComponent from './HeaderComponent';
import MovieDetailInformationComponent from './MovieDetailInformationComponent';
import MovieDetailReviewsComponent from './MovieDetailReviewsComponent';
import FooterComponent from './FooterComponent';

import './MovieDetailComponent.scss';
import { Movie } from '../models/Movie';
import Fetch from '../helper/Fetch';
import { HttpError } from '../models/HttpError';

type MovieDetailComponentProps = {
  location: {
    state: {
      movieRequestUrl: string
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
    console.log(serverResponse);
    this.setState({
      movie: serverResponse ?? [],
      isLoaded: true,
    });
  };

  requestErrorHandler = (serverResponse: HttpError) => {
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
