import React, { PureComponent } from 'react';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import withRouter from '../../helper/RouterHelper';
import withAppState, { ReduxState } from '../../helper/ReduxHelper';
import { AppState } from '../../redux/Store';

class UserProfileInformationCardComponent
  extends PureComponent <ReduxState> {
  render() {
    return (
      <Card>
        <Card.Header as="h3">{this.props.appState.currentUser?.username}</Card.Header>
        <Card.Body>
          <Card.Text>
            <FontAwesomeIcon icon={faEnvelope} />
            {' '}
            {this.props.appState.currentUser?.email_address}
            <br />
            <FontAwesomeIcon icon={faUserGroup} />
            {' '}
            {this.props.appState.currentUser?.role}
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

export default withRouter(withAppState(
  UserProfileInformationCardComponent,
  (state: AppState) => state,
));
