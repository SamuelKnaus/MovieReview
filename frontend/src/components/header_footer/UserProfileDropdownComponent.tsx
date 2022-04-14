import React, { PureComponent } from 'react';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavigateFunction } from 'react-router-dom';
import { Dropdown, Button } from 'react-bootstrap';
import withRouter from '../../helper/RouterHelper';
import withAppState, { ReduxState } from '../../helper/ReduxHelper';
import { AppState } from '../../redux/Store';

import './UserProfileDropdownComponent.scss';

interface UserProfileLoginComponentProps extends ReduxState {
  navigate: NavigateFunction
}

class UserProfileDropdownComponent
  extends PureComponent <UserProfileLoginComponentProps> {
  render() {
    if (this.props.appState.currentUser) {
      return (
        <div className="user-profile-login-wrapper">
          <Dropdown>
            <Dropdown.Toggle variant="login">
              <FontAwesomeIcon icon={faUser} />
              &nbsp;
              {this.props.appState.currentUser.username}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => this.props.navigate('/profile')}>My Profile</Dropdown.Item>
              <Dropdown.Item onClick={() => this.props.navigate('/logout')}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      );
    }

    return (
      <div className="user-profile-login-wrapper">
        <Button
          variant="login"
          onClick={() => this.props.navigate('/login')}
        >
          <FontAwesomeIcon icon={faUser} />
          {' Login'}
        </Button>
      </div>
    );
  }
}

export default withRouter(withAppState(UserProfileDropdownComponent, (state: AppState) => state));
