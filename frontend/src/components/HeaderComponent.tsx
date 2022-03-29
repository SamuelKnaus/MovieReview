import React from 'react';
import {
  Col,
  Container,
  Row,
} from 'react-bootstrap';

import './HeaderComponent.scss';

type HeaderComponentProps = {
  pageTitle: string
}

export default class HeaderComponent extends React.PureComponent<HeaderComponentProps> {
  render() {
    return (
      <header>
        <Container>
          <Row>
            <Col>
              <div className="site-title-wrapper">
                <h1 className="site-title">Movie Review</h1>
                <h2 className="page-title">{this.props.pageTitle}</h2>
              </div>
            </Col>
          </Row>
        </Container>
      </header>
    );
  }
}
