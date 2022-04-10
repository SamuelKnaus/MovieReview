import React, { PureComponent } from 'react';
import withAppState from '../helper/ReduxHelper';

class LoginComponent extends PureComponent {
  render() {
    return (
      <div>
        Login
      </div>
    );
  }
}

export default withAppState(LoginComponent);
