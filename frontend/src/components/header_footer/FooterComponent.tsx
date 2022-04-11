import React from 'react';

import { Container } from 'react-bootstrap';

import './FooterComponent.scss';

export default class FooterComponent extends React.PureComponent {
  render() {
    return (
      <footer>
        <Container>
          Movie Reviews
        </Container>
      </footer>
    );
  }
}
