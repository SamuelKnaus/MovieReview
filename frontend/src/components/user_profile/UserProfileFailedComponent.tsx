import React, { PureComponent } from 'react';
import { Alert, Container } from 'react-bootstrap';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import withRouter from '../../helper/RouterHelper';
import withAppState, { ReduxState } from '../../helper/ReduxHelper';
import { AppState } from '../../redux/Store';

class UserProfileFailedComponent
  extends PureComponent <ReduxState> {
  render() {
    return (
      <div className="user-profile-failed">
        <Container>
          <Alert variant="danger">
            <FontAwesomeIcon icon={faTriangleExclamation} />
            {' '}
            Please login first to access this page
          </Alert>
        </Container>
      </div>
    );
  }
}

export default withRouter(withAppState(
  UserProfileFailedComponent,
  (state: AppState) => state,
));
