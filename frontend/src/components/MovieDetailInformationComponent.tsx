import React, { PureComponent } from 'react';
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

import './MovieDetailInformationComponent.scss';
import { Movie } from '../models/Movie';

type MovieProps = {
  movie?: Movie
  categoryTitle: string
}

export default class MovieDetailInformationComponent extends PureComponent <MovieProps> {
  render() {
    return (
      <div className="move-item-information">
        <Container>
          <h3>
            <FontAwesomeIcon icon={faCircleInfo} />
            &nbsp;Information
          </h3>
          <ul>
            <li>
              {'Director: '}
              {this.props.movie?.director}
            </li>
            <li>
              {'Length: '}
              {this.props.movie?.length}
            </li>
            <li>
              {'Release Date: '}
              {this.props.movie?.release_date}
            </li>
            <li>
              {'Category: '}
              {this.props.categoryTitle}
            </li>
          </ul>
        </Container>
      </div>
    );
  }
}
