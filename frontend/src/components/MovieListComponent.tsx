import React from 'react';
import { Container, Table } from 'react-bootstrap';
import { NavigateFunction } from 'react-router-dom';
import moment from 'moment';
import withRouter from '../helper/RouterHelper';
import HeaderComponent from './HeaderComponent';
import { Movie } from '../models/Movie';
import { Category } from '../models/Category';
import { Collection } from '../models/Collection';
import Fetch from '../helper/Fetch';
import { HttpError } from '../models/HttpError';
import FooterComponent from './FooterComponent';
import withAppState, { ReduxState } from '../helper/ReduxHelper';
import { AppState } from '../redux/Store';

import './MovieListComponent.scss';

interface MovieListComponentProps extends ReduxState {
  navigate: NavigateFunction
}

type MovieListComponentState = {
  error: boolean,
  isLoaded: boolean,
  movies?: Movie[],
  categoryTitleMap?: Map<number, string>,
}

class MovieListComponent
  extends React.PureComponent<MovieListComponentProps, MovieListComponentState> {
  constructor(props: MovieListComponentProps) {
    super(props);
    this.state = {
      error: false,
      isLoaded: false,
    };
  }

  componentDidMount() {
    this.fetchMovieList();
    this.fetchCategoryList();
  }

  componentDidUpdate(prevProps: ReduxState) {
    if (prevProps.appState.allMoviesUrl !== this.props.appState.allMoviesUrl) {
      this.fetchMovieList();
    }
    if (prevProps.appState.allCategoriesUrl !== this.props.appState.allCategoriesUrl) {
      this.fetchCategoryList();
    }
  }

  movieRequestResponseHandler = (serverResponse: Collection<Movie>) => {
    this.setState({
      isLoaded: true,
      movies: serverResponse.items ?? [],
    });
  };

  movieRequestErrorHandler = (serverResponse: HttpError) => {
    this.setState({
      isLoaded: true,
    });
  };

  categoryRequestResponseHandler = (serverResponse: Collection<Category>) => {
    const categoryList = serverResponse.items ?? [];
    const categoryMap = new Map<number, string>();
    categoryList.forEach((category) => {
      categoryMap.set(category.id, category.title);
    });
    this.setState({
      isLoaded: true,
      categoryTitleMap: categoryMap,
    });
  };

  categoryRequestErrorHandler = (serverResponse: HttpError) => {
    this.setState({
      isLoaded: true,
    });
  };

  fetchMovieList() {
    if (this.props.appState.allMoviesUrl) {
      Fetch.getRequest(
        this.props.appState.allMoviesUrl,
        this.movieRequestResponseHandler,
        this.movieRequestErrorHandler,
      );
    }
  }

  fetchCategoryList() {
    if (this.props.appState.allCategoriesUrl) {
      Fetch.getRequest(
        this.props.appState.allCategoriesUrl,
        this.categoryRequestResponseHandler,
        this.categoryRequestErrorHandler,
      );
    }
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
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Director</th>
              <th>Length</th>
              <th>Category</th>
              <th>Release Date</th>
            </tr>
          </thead>
          <tbody>
            {this.state.movies?.map((movie, index) => {
              const parsedDate = moment(movie.release_date, 'YYYY-MM-DD');
              const outputDate = parsedDate.format('DD.MM.YYYY');

              let minutes = Math.floor(movie.length / 60);
              const hours = Math.floor(minutes / 60);
              minutes %= 60;

              return (
                <tr className="movie-list-item" key={movie.id} onClick={() => this.props.navigate(`/movie/${movie.id}`)}>
                  <td>{index + 1}</td>
                  <td>{movie.title}</td>
                  <td>{movie.director}</td>
                  <td>
                    {hours}
                    :
                    {minutes}
                    &nbsp;h
                  </td>
                  <td>{this.state.categoryTitleMap?.get(movie.category_id)}</td>
                  <td>{outputDate}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      );
    }
    return (
      <div className="movie-list">
        <HeaderComponent pageTitle="Movie List" />
        <div className="main">
          <div className="movie-list-table">
            <Container>
              {content}
            </Container>
          </div>
        </div>
        <FooterComponent />
      </div>
    );
  }
}

export default withRouter(withAppState(MovieListComponent, (state: AppState) => state));
