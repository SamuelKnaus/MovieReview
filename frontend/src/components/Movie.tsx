import React from 'react';
import useParams from 'react-router-dom';


type MovieState = {
  movieId: number
}

function MovieComponent() {
  let { movieId } = useParams();

  return (
    <h1>
      Start
      {this.state.movieId}
    </h1>
  );
}

export default MovieComponent;
