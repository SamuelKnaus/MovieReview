import { PureComponent } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { ReduxState } from '../helper/ReduxHelper';
import { DELETE_AUTHENTICATION_TOKEN, DELETE_CURRENT_USER } from '../redux/Reducer';

interface LogoutComponentProps extends ReduxState {
    navigate: NavigateFunction
  }

class LogoutComponent extends PureComponent<LogoutComponentProps> {
  componentDidMount() {
    this.props.appStateDispatch({ type: DELETE_AUTHENTICATION_TOKEN });
    this.props.appStateDispatch({ type: DELETE_CURRENT_USER });
    this.props.navigate('/login');
  }

  render() {
    return null;
  }
}
