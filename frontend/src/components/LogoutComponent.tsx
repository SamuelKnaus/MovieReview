import React, { PureComponent } from 'react';
import { Navigate } from 'react-router-dom';
import withAppState, { ReduxState } from '../helper/ReduxHelper';
import { DELETE_AUTHENTICATION_TOKEN, DELETE_CURRENT_USER } from '../redux/Reducer';

class LogoutComponent extends PureComponent<ReduxState> {
  render() {
    this.props.appStateDispatch({ type: DELETE_AUTHENTICATION_TOKEN });
    this.props.appStateDispatch({ type: DELETE_CURRENT_USER });
    return <Navigate to="/login" />;
  }
}

export default withAppState(LogoutComponent);
