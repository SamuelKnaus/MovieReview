import React, { PureComponent } from 'react';
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { Movie } from '../models/Movie';

import './MovieDetailInformationComponent.scss';

type MovieProps = {
  movie?: Movie
  categoryTitle: string
}

export default class MovieDetailInformationComponent extends PureComponent <MovieProps> {
  render() {
    const movieLength = this.props.movie?.length;
    const minutes = Math.floor((movieLength ?? 60) / 60);

    const parsedDate = moment(this.props.movie?.release_date, 'YYYY-MM-DD');
    const outputDate = parsedDate.format('DD.MM.YYYY');

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
              {minutes}
              {' minutes'}
            </li>
            <li>
              {'Release Date: '}
              {outputDate}
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
