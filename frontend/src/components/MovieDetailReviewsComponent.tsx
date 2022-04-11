import React, { PureComponent } from 'react';
import {
  Button, Col, Container, Row, Accordion, Card, useAccordionButton,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQuoteRight, faComments, faQuoteLeft, faStar, faPlus,
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
          <div className="section-title">
            <div className="title-wrapper">
              <h3 className="title">
                <FontAwesomeIcon icon={faComments} />
                {' Reviews'}
              </h3>
            </div>

            <div className="add-review">
              <Button variant="outline-primary">
                <FontAwesomeIcon icon={faPlus} />
                {' add review'}
              </Button>
            </div>
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
