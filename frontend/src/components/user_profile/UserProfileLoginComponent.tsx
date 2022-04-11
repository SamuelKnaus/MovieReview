import React, { PureComponent } from 'react';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavigateFunction } from 'react-router-dom';
import withRouter from '../../helper/RouterHelper';
import withAppState, { ReduxState } from '../../helper/ReduxHelper';
import { AppState } from '../../redux/Store';

import './UserProfileLoginComponent.scss';

interface UserProfileLoginComponentProps extends ReduxState {
  navigate: NavigateFunction
}

class UserProfileLoginComponent
  extends PureComponent <UserProfileLoginComponentProps> {
  render() {
    console.log(this.props.appState);
    if (this.props.appState.currentUser) {
      return (
        <div
          role="button"
          tabIndex={0}
          className="user-profile-login-wrapper"
          onClick={() => this.props.navigate('/profile')}
          onKeyDown={() => this.props.navigate('/profile')}
        >
          <FontAwesomeIcon icon={faUser} />
          {' '}
          {this.props.appState.currentUser.username}
        </div>
      );
    }

    return (
      <div
        role="button"
        tabIndex={0}
        className="user-profile-login-wrapper"
        onClick={() => this.props.navigate('/login')}
        onKeyDown={() => this.props.navigate('/login')}
      >
        <FontAwesomeIcon icon={faUser} />
        {' Login'}
      </div>
    );
  }
}

export default withRouter(withAppState(UserProfileLoginComponent, (state: AppState) => state));
