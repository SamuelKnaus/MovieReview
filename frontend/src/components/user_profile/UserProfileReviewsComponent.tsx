import React, { PureComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComments, faQuoteLeft, faQuoteRight, faStar,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { Col, Row } from 'react-bootstrap';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
import withRouter from '../../helper/RouterHelper';
import { AppState } from '../../redux/Store';
import { Review } from '../../models/Review';
import { Collection } from '../../models/Collection';
import { HttpError } from '../../models/HttpError';
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

  requestErrorHandler = (serverResponse: HttpError) => {
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
            const parsedDate = moment(userReview.date, 'YYYY-MM-DD HH:mm:ss.SSS');
            const outputDate = parsedDate.format('DD.MM.YYYY HH:mm');

            return (
              <Col md={6} key={index.valueOf()}>
                <div className="review">
                  <div className="meta-information">
                    <div className="date">{outputDate}</div>
                    <div className="rating">
                      {Array.from(Array(userReview.rating).keys())
                        .map(() => <FontAwesomeIcon icon={faStar} />)}
                      {Array.from(Array(5 - userReview.rating).keys())
                        .map(() => <FontAwesomeIcon icon={faStarEmpty} />)}
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
