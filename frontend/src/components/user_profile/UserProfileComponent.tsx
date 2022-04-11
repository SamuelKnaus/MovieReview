import React, { PureComponent } from 'react';
import { Container } from 'react-bootstrap';
import withRouter from '../../helper/RouterHelper';
import HeaderComponent from '../header_footer/HeaderComponent';
import FooterComponent from '../header_footer/FooterComponent';
import withAppState, { ReduxState } from '../../helper/ReduxHelper';
import { AppState } from '../../redux/Store';

import './UserProfileComponent.scss';

class UserProfileComponent
  extends PureComponent <ReduxState> {
  render() {
    return (
      <div className="user-profile">
        <HeaderComponent pageTitle="My Profile" />
        <div className="main">
          <Container>
            <h2>PLACEHOLDER</h2>
          </Container>
        </div>
        <FooterComponent />
      </div>
    );
  }
}

export default withRouter(withAppState(UserProfileComponent, (state: AppState) => state));
