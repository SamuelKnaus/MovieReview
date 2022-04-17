import React from 'react';
import { Container, Spinner, Table } from 'react-bootstrap';
import { NavigateFunction } from 'react-router-dom';
import moment from 'moment';
import withRouter from '../../helper/RouterHelper';
import HeaderComponent from '../header_footer/HeaderComponent';
import { Movie } from '../../models/Movie';
import { Category } from '../../models/Category';
import { Collection } from '../../models/Collection';
import Fetch from '../../helper/Fetch';
import FooterComponent from '../header_footer/FooterComponent';
import withAppState, { ReduxState } from '../../helper/ReduxHelper';
import { AppState } from '../../redux/Store';

import './MovieListComponent.scss';

interface MovieListComponentProps extends ReduxState {
  navigate: NavigateFunction
}

type MovieListComponentState = {
  isLoaded: boolean,
  movies?: Movie[],
  categoryTitleMap?: Map<number, string>,
}

class MovieListComponent
  extends React.PureComponent<MovieListComponentProps, MovieListComponentState> {
  constructor(props: MovieListComponentProps) {
    super(props);
    this.state = {
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

  private movieRequestResponseHandler = (serverResponse: Collection<Movie>) => {
    this.setState({
      isLoaded: true,
      movies: serverResponse.items ?? [],
    });
  };

  private movieRequestErrorHandler = () => {
    this.setState({
      isLoaded: true,
    });
  };

  private categoryRequestResponseHandler = (serverResponse: Collection<Category>) => {
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

  private categoryRequestErrorHandler = () => {
    this.setState({
      isLoaded: true,
    });
  };

  private fetchMovieList() {
    if (this.props.appState.allMoviesUrl) {
      Fetch.getRequest(
        this.props.appState.allMoviesUrl,
        this.movieRequestResponseHandler,
        this.movieRequestErrorHandler,
      );
    }
  }

  private fetchCategoryList() {
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
    if (!this.state.isLoaded) {
      content = (
        <div
          className="loading-spinner"
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    } else if (!this.state.movies) {
      content = (
        <div
          className="loading-failed"
        >
          Could not be loaded
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
              const outputDate = moment(movie.release_date).format('DD.MM.YYYY');

              const minutes = Math.floor(movie.length / 60);

              return (
                <tr
                  className="movie-list-item"
                  key={index.valueOf()}
                  onClick={
                    () => this.props.navigate(`/movie/${movie.id}`, {
                      state: {
                        movieRequestUrl: movie['@controls'].self?.href,
                        categoryTitle: this.state.categoryTitleMap?.get(movie.category_id),
                      },
                    })
                  }
                >
                  <td>{index + 1}</td>
                  <td>{movie.title}</td>
                  <td>{movie.director}</td>
                  <td>
                    {minutes}
                    {' minutes'}
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
