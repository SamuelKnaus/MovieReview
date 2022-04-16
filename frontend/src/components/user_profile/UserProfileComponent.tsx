import React, { PureComponent } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import withRouter from '../../helper/RouterHelper';
import HeaderComponent from '../header_footer/HeaderComponent';
import FooterComponent from '../header_footer/FooterComponent';
import withAppState, { ReduxState } from '../../helper/ReduxHelper';
import { AppState } from '../../redux/Store';
import UserProfileInformationComponent from './UserProfileInformationCardComponent';
import UserProfileFailedComponent from './UserProfileFailedComponent';
import UserProfileReviewsComponent from './UserProfileReviewsComponent';

import './UserProfileComponent.scss';

class UserProfileComponent
  extends PureComponent <ReduxState> {
  render() {
    if (this.props.appState.currentUser) {
      return (
        <div className="user-profile">
          <HeaderComponent pageTitle="My Profile" />
          <div className="main">
            <Container>
              <Row>
                <Col md={3}>
                  <UserProfileInformationComponent />
                </Col>

                <Col md={{ span: 8, offset: 1 }}>
                  <UserProfileReviewsComponent
                    userReviewsUrl={this.props.appState.currentUser?.['@controls']['moviereviewmeta:reviews-of-user']?.href}
                  />
                </Col>
              </Row>
            </Container>
          </div>
          <FooterComponent />
        </div>
      );
    }
    return (
      <div className="user-profile">
        <HeaderComponent pageTitle="Login required" />
        <div className="main">
          <UserProfileFailedComponent />
        </div>
        <FooterComponent />
      </div>
    );
  }
}

export default withRouter(withAppState(UserProfileComponent, (state: AppState) => state));
