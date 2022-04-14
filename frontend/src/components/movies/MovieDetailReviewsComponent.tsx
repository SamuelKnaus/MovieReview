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
import { HttpError } from '../../models/HttpError';
import withAppState, { ReduxState } from '../../helper/ReduxHelper';
import { AppState } from '../../redux/Store';
import ModalComponent from './ModalComponent';

import './MovieDetailReviewsComponent.scss';
import { MasonControl } from '../../models/MasonDoc';

interface MovieDetailReviewsComponentProps extends ReduxState {
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

  componentDidUpdate(prevProps: MovieDetailReviewsComponentProps) {
    if (this.props.reviewsUrl && prevProps.reviewsUrl !== this.props.reviewsUrl) {
      this.fetchReviewList();
    }
  }

  requestResponseHandler = (serverResponse: Collection<Review>) => {
    this.setState({
      isLoaded: true,
      reviews: serverResponse.items ?? [],
      addReviewMasonDoc: serverResponse['@controls']['moviereviewmeta:add-review'],
    });
  };

  requestErrorHandler = (serverResponse: HttpError) => {
    this.setState({
      isLoaded: false,
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

            <ModalComponent
              title="Add Review"
              submitUrl={this.state.addReviewMasonDoc?.href}
              schema={this.state.addReviewMasonDoc?.schema}
              httpMethod="POST"
              button={(
                <Button variant="outline-primary">
                  <FontAwesomeIcon icon={faPlus} />
                  {' '}
                  Add Review
                </Button>
              )}
            />
          </div>

          <Row>
            {this.state.reviews?.map((review, index) => {
              const outputDate = moment(review.date).format('DD.MM.YYYY HH:mm');

              return (
                <Col md={4} key={index.valueOf()}>
                  <div className="review">
                    <div className="author">
                      <h4>{review.author}</h4>

                      <div className="actions">
                        <ModalComponent
                          title="Edit Review"
                          button={<FontAwesomeIcon className="edit-review-icon" icon={faPenToSquare} />}
                          getMasonDocUrl={review['@controls'].self?.href}
                          getMasonDocKey="edit"
                          review={review}
                        />

                        <div className="delete-review">
                          <ModalComponent
                            title="Edit Review"
                            button={<FontAwesomeIcon icon={faTrashCan} className="delete-review-icon" />}
                            getMasonDocUrl={review['@controls'].self?.href}
                            getMasonDocKey="moviereviewmeta:delete"
                          />
                        </div>
                      </div>
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
