import React, { PureComponent } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQuoteRight, faComments, faQuoteLeft, faStar,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';

import './MovieDetailReviewsComponent.scss';
import { Collection } from '../models/Collection';
import { Review } from '../models/Review';
import Fetch from '../helper/Fetch';
import { HttpError } from '../models/HttpError';

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
            <Col>
              <div className="review">
                <div className="author">
                  <h4>Curt Cobain</h4>
                </div>
                <div className="meta-information">
                  <div className="date">01.02.19941</div>
                  <div className="rating">
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                  </div>
                </div>
                <div className="comment">
                  <FontAwesomeIcon icon={faQuoteLeft} />
                  &nbsp;Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                  eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                  At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
                  gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum
                  dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                  invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos
                  et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
                  takimata sanctus est Lorem ipsum dolor sit amet.&nbsp;
                  <FontAwesomeIcon icon={faQuoteRight} />
                </div>
              </div>
            </Col>

            <Col>
              <div className="review">
                <div className="author">
                  <h4>Max Mustermann</h4>
                </div>
                <div className="meta-information">
                  <div className="date">12.34.5678</div>
                  <div className="rating">
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStarEmpty} />
                  </div>
                </div>
                <div className="comment">
                  <FontAwesomeIcon icon={faQuoteLeft} />
                  &nbsp;Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                  eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                  At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
                  gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum
                  dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                  invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos
                  et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
                  takimata sanctus est Lorem ipsum dolor sit amet.&nbsp;
                  <FontAwesomeIcon icon={faQuoteRight} />
                </div>
              </div>
            </Col>

            <Col>
              <div className="review">
                <div className="author">
                  <h4>Deine Mutter</h4>
                </div>
                <div className="meta-information">
                  <div className="date">24.02.2021</div>
                  <div className="rating">
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStarEmpty} />
                    <FontAwesomeIcon icon={faStarEmpty} />
                    <FontAwesomeIcon icon={faStarEmpty} />
                    <FontAwesomeIcon icon={faStarEmpty} />
                  </div>
                </div>
                <div className="comment">
                  <FontAwesomeIcon icon={faQuoteLeft} />
                  &nbsp;Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                  eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                  At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
                  gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum
                  dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                  invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos
                  et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
                  takimata sanctus est Lorem ipsum dolor sit amet.&nbsp;
                  <FontAwesomeIcon icon={faQuoteRight} />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
