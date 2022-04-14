import React, { PureComponent } from 'react';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavigateFunction } from 'react-router-dom';
import {
  Col, Container, Row, Form, FloatingLabel, Button,
} from 'react-bootstrap';
import withAppState, { ReduxState } from '../../helper/ReduxHelper';
import { Credentials } from '../../models/Credentials';
import Fetch from '../../helper/Fetch';
import { Token } from '../../models/Token';
import { AppState } from '../../redux/Store';
import {
  DELETE_AUTHENTICATION_TOKEN, DELETE_CURRENT_USER, SET_AUTHENTICATION_TOKEN, SET_CURRENT_USER,
} from '../../redux/Reducer';
import { HttpError } from '../../models/HttpError';
import withRouter from '../../helper/RouterHelper';
import { User } from '../../models/User';
import HeaderComponent from '../header_footer/HeaderComponent';
import FooterComponent from '../header_footer/FooterComponent';

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

  componentDidMount() {
    if (this.props.appState.authenticationToken) {
      this.fetchCurrentUser();
    }
  }

  loginSuccessful = (serverResponse: Token) => {
    this.props.appStateDispatch({ type: SET_AUTHENTICATION_TOKEN, value: serverResponse.token });
    this.setState({
      errorMessage: '',
    });
    this.fetchCurrentUser();
  };

  loginError = (serverResponse: HttpError) => {
    this.props.appStateDispatch({ type: DELETE_AUTHENTICATION_TOKEN });
    this.props.appStateDispatch({ type: DELETE_CURRENT_USER });
    this.setState({
      password: '',
      errorMessage: serverResponse.message,
    });
  };

  userFetchSuccessful = (serverResponse: User) => {
    this.props.appStateDispatch({ type: SET_CURRENT_USER, value: serverResponse });
    this.setState({
      errorMessage: '',
    });
    this.props.navigate('/');
  };

  userFetchError = () => {
    this.props.appStateDispatch({ type: DELETE_AUTHENTICATION_TOKEN });
    this.props.appStateDispatch({ type: DELETE_CURRENT_USER });
    this.setState({
      password: '',
      errorMessage: 'Something went wrong during the login',
    });
  };

  sendLoginRequest() {
    console.log('test');

    const body: Credentials = {
      username: this.state.username,
      password: this.state.password,
    };
    Fetch.login(this.props.appState.loginUrl ?? '', body, this.loginSuccessful, this.loginError);
  }

  fetchCurrentUser() {
    Fetch.getRequest(
      this.props.appState.currentUserUrl ?? '',
      this.userFetchSuccessful,
      this.userFetchError,
    );
  }

  render() {
    return (
      <div className="login-page">
        <HeaderComponent pageTitle="Login" />

        <div className="main">
          <Container>
            <Row className="justify-content-md-center">
              <Col md="3">
                <Form>
                  <div className="login-icon">
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      className="user-icon"
                    />
                  </div>

                  <Form.Group className="mb-3" controlId="login.Username">
                    <FloatingLabel
                      label="Username"
                    >
                      <Form.Control
                        type="text"
                        placeholder="Username"
                        value={this.state.username}
                        onChange={(event) => this.setState({ username: event.target.value })}
                      />
                    </FloatingLabel>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="login.Password">
                    <FloatingLabel
                      label="Password"
                    >
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={(event) => this.setState({ password: event.target.value })}
                      />
                    </FloatingLabel>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="login.ErrorMessage">
                    <Form.Text>
                      {this.state.errorMessage}
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="login.Submit">
                    <Button
                      variant="primary"
                      onClick={() => this.sendLoginRequest()}
                    >
                      Login
                    </Button>
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          </Container>
        </div>

        <FooterComponent />
      </div>
    );
  }
}

export default withRouter(withAppState(LoginComponent, (state: AppState) => state));
