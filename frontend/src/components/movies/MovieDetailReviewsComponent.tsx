import React, { PureComponent } from 'react';
import {
  Col, Container, Row,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQuoteRight, faComments, faQuoteLeft, faStar, faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
import moment from 'moment';
import { Collection } from '../../models/Collection';
import { Review } from '../../models/Review';
import Fetch from '../../helper/Fetch';
import { HttpError } from '../../models/HttpError';
import withAppState, { ReduxState } from '../../helper/ReduxHelper';
import { AppState } from '../../redux/Store';
import ModalComponent from '../common/ModalComponent';

import './MovieDetailReviewsComponent.scss';

interface MovieDetailReviewsComponentProps extends ReduxState {
  reviewsUrl?: string,
}

type MovieDetailReviewsComponentState = {
  isLoaded: boolean,
  reviews?: Review[],
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
    });
  };

  requestErrorHandler = (serverResponse: HttpError) => {
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
              edit={false}
              title="Add Review"
            />
          </div>

          <Row>
            {this.state.reviews?.map((review, index) => {
              const parsedDate = moment(review.date, 'YYYY-MM-DD HH:mm:ss.SSS');
              const outputDate = parsedDate.format('DD.MM.YYYY HH:mm');

              return (
                <Col md={4} key={index.valueOf()}>
                  <div className="review">
                    <div className="author">
                      <h4>{review.author}</h4>
                      <ModalComponent
                        edit
                        title="Edit Review"
                      />
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
