import React, { PureComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComments, faQuoteLeft, faQuoteRight, faStar,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { Col, Row, Spinner } from 'react-bootstrap';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
import withRouter from '../../helper/RouterHelper';
import { AppState } from '../../redux/Store';
import { Review } from '../../models/Review';
import { Collection } from '../../models/Collection';
import Fetch from '../../helper/Fetch';
import withAppState from '../../helper/ReduxHelper';

import './UserProfileReviewsComponent.scss';

type UserProfileReviewsComponentProps = {
  userReviewsUrl?: string
}

type UserProfileReviewsComponentState = {
  isLoaded: boolean,
  userReviews?: Review[]
}

class UserProfileReviewsComponent
  extends PureComponent <UserProfileReviewsComponentProps, UserProfileReviewsComponentState> {
  constructor(props: UserProfileReviewsComponentProps) {
    super(props);

    this.state = {
      isLoaded: false,
    };
  }

  componentDidMount() {
    this.fetchUserReviewList();
  }

  requestResponseHandler = (serverResponse: Collection<Review>) => {
    this.setState({
      isLoaded: true,
      userReviews: serverResponse.items ?? [],
    });
  };

  requestErrorHandler = () => {
    this.setState({
      isLoaded: true,
    });
  };

  fetchUserReviewList() {
    if (this.props.userReviewsUrl) {
      Fetch.getRequest(
        this.props.userReviewsUrl,
        this.requestResponseHandler,
        this.requestErrorHandler,
      );
    }
  }

  render() {
    if (!this.state.isLoaded) {
      return (
        <div className="my-reviews-loading-spinner">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    }
    if (this.state.isLoaded && !this.state.userReviews) {
      return (
        <div
          className="my-reviews-loading-failed"
        >
          Could not be loaded
        </div>
      );
    }
    return (
      <div className="my-reviews">
        <div className="section-title">
          <div className="title-wrapper">
            <h3 className="title">
              <FontAwesomeIcon icon={faComments} />
              {' My Reviews'}
            </h3>
          </div>
        </div>

        <Row>
          {this.state.userReviews?.map((userReview, index) => {
            const outputDate = moment(userReview.date).format('DD.MM.YYYY HH:mm');

            return (
              <Col md={6} key={index.valueOf()}>
                <div className="review">
                  <div className="meta-information">
                    <div className="date">{outputDate}</div>
                    <div className="rating">
                      {Array.from(Array(userReview.rating).keys())
                        .map((_, itStar) => (
                          <FontAwesomeIcon
                            key={itStar.valueOf()}
                            icon={faStar}
                          />
                        ))}
                      {Array.from(Array(5 - userReview.rating).keys())
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
                    {userReview.comment}
                    &nbsp;
                    <FontAwesomeIcon icon={faQuoteRight} />
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    );
  }
}

export default withRouter(withAppState(
  UserProfileReviewsComponent,
  (state: AppState) => state,
));
