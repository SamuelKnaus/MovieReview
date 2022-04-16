import React, { PureComponent } from 'react';
import {
  Col, Container, Button, Row, Spinner,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQuoteRight, faComments, faQuoteLeft, faStar, faTrashCan, faPenToSquare, faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
import moment from 'moment';
import { Collection } from '../../models/Collection';
import { Review } from '../../models/Review';
import Fetch from '../../helper/Fetch';
import withAppState, { ReduxState } from '../../helper/ReduxHelper';
import { AppState } from '../../redux/Store';
import ModalComponent from './ModalComponent';

import './MovieDetailReviewsComponent.scss';
import { MasonControl } from '../../models/MasonDoc';
import { Movie } from '../../models/Movie';
import { UserType } from '../../models/User';

interface MovieDetailReviewsComponentProps extends ReduxState {
  movie: Movie,
  reviewsUrl?: string,
}

type MovieDetailReviewsComponentState = {
  isLoaded: boolean,
  reviews?: Review[],
  addReviewMasonDoc?: MasonControl
}

class MovieDetailReviewsComponent
  extends PureComponent<MovieDetailReviewsComponentProps, MovieDetailReviewsComponentState> {
  constructor(props: MovieDetailReviewsComponentProps) {
    super(props);

    this.state = {
      isLoaded: false,
    };
  }

  componentDidMount() {
    this.fetchReviewList();
  }

  requestResponseHandler = (serverResponse: Collection<Review>) => {
    this.setState({
      isLoaded: true,
      reviews: serverResponse.items ?? [],
      addReviewMasonDoc: serverResponse['@controls']['moviereviewmeta:add-review'],
    });
  };

  requestErrorHandler = () => {
    this.setState({
      isLoaded: true,
    });
  };

  fetchReviewList() {
    if (this.props.reviewsUrl) {
      Fetch.getRequest(
        this.props.reviewsUrl,
        this.requestResponseHandler,
        this.requestErrorHandler,
      );
    }
  }

  render() {
    if (!this.state.isLoaded) {
      return (
        <div className="reviews-loading-spinner">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    }
    if (this.state.isLoaded && !this.state.reviews) {
      return (
        <div />
      );
    }
    return (
      <div className="reviews">
        <Container>
          <div className="section-title">
            <div className="title-wrapper">
              <h3 className="title">
                <FontAwesomeIcon icon={faComments} />
                {' Reviews'}
              </h3>
            </div>

            {this.props.appState.currentUser && (
              <ModalComponent
                title="Add Review"
                submitUrl={this.state.addReviewMasonDoc?.href}
                schema={this.state.addReviewMasonDoc?.schema}
                successHandler={(newReview: Review) => this.setState((prevState) => ({
                  reviews: (prevState.reviews ?? []).concat(newReview),
                }))}
                httpMethod="POST"
                button={(
                  <Button variant="outline-primary">
                    <FontAwesomeIcon icon={faPlus} />
                    {' '}
                    Add Review
                  </Button>
                )}
                review={{
                  author: this.props.appState.currentUser?.username,
                  movie_id: this.props.movie.id,
                  date: moment().format(),
                }}
              />
            )}
          </div>

          <Row>
            {this.state.reviews?.map((review, index) => {
              const outputDate = moment(review.date).format('DD.MM.YYYY HH:mm');

              return (
                <Col md={4} key={index.valueOf()}>
                  <div className="review">
                    <div className="author">
                      <h4>{review.author}</h4>

                      {(this.props.appState.currentUser?.username === review.author
                        || this.props.appState.currentUser?.role === UserType.ADMIN) && (
                        <div className="actions">
                          <ModalComponent
                            title="Edit Review"
                            button={<FontAwesomeIcon className="edit-review-icon" icon={faPenToSquare} />}
                            successHandler={(editedReview: Review) => this.setState(
                              (prevState) => ({
                                reviews: (prevState.reviews ?? [])
                                  .map((rev, revIdx) => (revIdx === index ? editedReview : rev)),
                              }),
                            )}
                            getMasonDocUrl={review['@controls'].self?.href}
                            getMasonDocKey="edit"
                            review={review}
                          />

                          <div className="delete-review">
                            <ModalComponent
                              title="Delete Review"
                              button={<FontAwesomeIcon icon={faTrashCan} className="delete-review-icon" />}
                              successHandler={() => this.setState((prevState) => ({
                                reviews: prevState.reviews?.filter((_, revIdx) => index !== revIdx),
                              }))}
                              getMasonDocUrl={review['@controls'].self?.href}
                              getMasonDocKey="moviereviewmeta:delete"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="meta-information">
                      <div className="date">{outputDate}</div>
                      <div className="rating">
                        {Array.from(Array(review.rating).keys())
                          .map((_, itStar) => (
                            <FontAwesomeIcon
                              key={itStar.valueOf()}
                              icon={faStar}
                            />
                          ))}
                        {Array.from(Array(5 - review.rating).keys())
                          .map((_, itEmptyStar) => (
                            <FontAwesomeIcon
                              key={itEmptyStar.valueOf()}
                              icon={faStarEmpty}
                            />
                          ))}
                      </div>
                    </div>
                    <div className="comment">
                      <FontAwesomeIcon icon={faQuoteLeft} />
                      &nbsp;
                      {review.comment}
                      &nbsp;
                      <FontAwesomeIcon icon={faQuoteRight} />
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Container>
      </div>
    );
  }
}

export default withAppState(MovieDetailReviewsComponent, (state: AppState) => state);
