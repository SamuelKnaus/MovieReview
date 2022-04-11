import React, { PureComponent } from 'react';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavigateFunction } from 'react-router-dom';
import withAppState, { ReduxState } from '../helper/ReduxHelper';
import { Credentials } from '../models/Credentials';
import Fetch from '../helper/Fetch';
import { Token } from '../models/Token';
import { AppState } from '../redux/Store';
import { SET_AUTHENTICATION_TOKEN } from '../redux/Reducer';
import { HttpError } from '../models/HttpError';
import withRouter from '../helper/RouterHelper';

import './LoginComponent.scss';

interface LoginComponentProps extends ReduxState {
  navigate: NavigateFunction
}

interface LoginComponentState {
  username: string
  password: string
  errorMessage: string
}

const initialState = {
  username: '',
  password: '',
  errorMessage: '',
};

class LoginComponent extends PureComponent<LoginComponentProps, LoginComponentState> {
  constructor(props: LoginComponentProps) {
    super(props);

    this.state = initialState;
  }

  requestSuccessful = (serverResponse: Token) => {
    const { token } = serverResponse;
    this.props.appStateDispatch({ type: SET_AUTHENTICATION_TOKEN, value: token });
    this.setState({
      errorMessage: '',
    });
    this.props.navigate('/');
  };

  requestError = (serverResponse: HttpError) => {
    this.props.appStateDispatch({ type: SET_AUTHENTICATION_TOKEN, value: '' });
    this.setState({
      password: '',
      errorMessage: serverResponse.message,
    });
  };

  sendLoginRequest() {
    const body: Credentials = {
      username: this.state.username,
      password: this.state.password,
    };
    Fetch.login(this.props.appState.loginUrl ?? '', body, this.requestSuccessful, this.requestError);
  }

  render() {
    return (
      <div className="login-page">
        <FontAwesomeIcon
          icon={faUserCircle}
          className="user-icon"
        />
        <input
          type="text"
          placeholder="Username"
          value={this.state.username}
          onChange={(event) => this.setState({ username: event.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={this.state.password}
          onChange={(event) => this.setState({ password: event.target.value })}
        />
        <input
          className="login-button"
          type="button"
          value="Login"
          onClick={() => this.sendLoginRequest()}
        />
        <span
          className="error-message"
        >
          {this.state.errorMessage}
        </span>
      </div>
    );
  }
}

export default withRouter(withAppState(LoginComponent, (state: AppState) => state));
