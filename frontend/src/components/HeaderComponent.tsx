import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClapperboard } from '@fortawesome/free-solid-svg-icons';
import {
  Col,
  Container,
  Row,
} from 'react-bootstrap';
import { NavigateFunction } from 'react-router-dom';
import UserProfileLoginComponent from './profile/UserProfileLoginComponent';
import withAppState, { ReduxState } from '../helper/ReduxHelper';
import withRouter from '../helper/RouterHelper';
import { AppState } from '../redux/Store';

import './HeaderComponent.scss';

interface HeaderComponentProps extends ReduxState {
  navigate: NavigateFunction
  pageTitle: string
}

class HeaderComponent
  extends React.PureComponent <HeaderComponentProps> {
  render() {
    return (
      <header>
        <Container>
          <Row>
            <Col>
              <div className="header-wrapper">
                <div className="site-title-wrapper">
                  <div
                    role="button"
                    tabIndex={0}
                    className="root-link"
                    onClick={() => this.props.navigate('/')}
                    onKeyDown={() => this.props.navigate('/')}
                  >
                    <h1 className="site-title">
                      <FontAwesomeIcon icon={faClapperboard} />
                      {' Movie Reviews'}
                    </h1>
                  </div>
                </div>

                <div className="bottom-bar">
                  <div className="page-title-wrapper">
                    <h2 className="page-title">{this.props.pageTitle}</h2>
                  </div>

                  <UserProfileLoginComponent />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </header>
    );
  }
}

export default withRouter(withAppState(HeaderComponent, (state: AppState) => state));
