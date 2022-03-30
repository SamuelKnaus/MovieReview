import React, { PureComponent } from 'react';
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import withRouter from '../helper/RouterHelper';

import './MovieDetailInformationComponent.scss';

type MovieProps = {
  params: {
    movieId: number
  }
}

class MovieDetailInformationComponent extends PureComponent <MovieProps> {
  render() {
    return (
      <div className="move-item-information">
        <Container>
          <h3>
            <FontAwesomeIcon icon={faCircleInfo} />
            &nbsp;Information
          </h3>
          {this.props.params.movieId}
          <ul>
            <li>Director: abc</li>
            <li>Length: 123</li>
            <li>Release Date: 01.02.1998</li>
            <li>Category: Crime</li>
          </ul>
        </Container>
      </div>
    );
  }
}

export default withRouter(MovieDetailInformationComponent);
