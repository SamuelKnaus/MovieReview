import React, { PureComponent } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQuoteRight, faComments, faQuoteLeft, faStar,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
import moment from 'moment';
import { Collection } from '../models/Collection';
import { Review } from '../models/Review';
import Fetch from '../helper/Fetch';
import { HttpError } from '../models/HttpError';

import './MovieDetailReviewsComponent.scss';

type MovieDetailReviewsComponentProps = {
  reviewsUrl?: string
}

type MovieDetailReviewsComponentState = {
  isLoaded: boolean,
  reviews?: Review[]
}

export default class MovieDetailReviewsComponent
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
          <h3 className="title">
            <FontAwesomeIcon icon={faComments} />
            &nbsp;Reviews
          </h3>

          <Row>
            {this.state.reviews?.map((review, index) => {
              const parsedDate = moment(review.date, 'YYYY-MM-DD HH:mm:ss.SSS');
              const outputDate = parsedDate.format('DD.MM.YYYY HH:mm');

              return (
                <Col md={4} key={index.valueOf()}>
                  <div className="review">
                    <div className="author">
                      <h4>{review.author}</h4>
                    </div>
                    <div className="meta-information">
                      <div className="date">{outputDate}</div>
                      <div className="rating">
                        <FontAwesomeIcon icon={faStar} />
                        <FontAwesomeIcon icon={faStarEmpty} />
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
