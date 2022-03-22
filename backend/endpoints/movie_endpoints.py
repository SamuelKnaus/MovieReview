"""
    All the endpoints for the movie resource
"""

from flask import request
from flask_restful import Resource

import api
from database.models import Movie
from helper.request_blueprints import get_blueprint, put_blueprint, delete_blueprint, post_blueprint
from json_schemas.movie_json_schema import get_movie_json_schema
from mason.mason_builder import MasonBuilder


class MovieCollection(Resource):
    """
        This class represents the movie collection endpoints
        It contains the definition of a get and a post endpoint
    """
    @classmethod
    def get(cls):
        """
            This method represents the get endpoint of this resource
            output:
                the http response object containing either the list of movies
                or a http error with the corresponding error message
        """
        movies = Movie.query.all()
        body = []
        for movie in movies:
            item = MasonBuilder(movie.serialize())
            item.add_control_get_movie(movie)
            item.add_control_update_movie(movie)
            item.add_control_delete_movie(movie)
            body.append(item)
        return get_blueprint(body)

    @classmethod
    def __create_movie_object(cls, created_movie):
        created_movie.deserialize(request.json)
        return created_movie

    def post(self):
        """
            This method represents the post endpoint of this resource,
            which is used to add a new movie to the database
            It uses the blueprint function of the helper module
            output:
                a http response object representing the result of this operation
        """
        movie = Movie()
        return post_blueprint(
            request,
            get_movie_json_schema,
            api.DB,
            lambda: self.__create_movie_object(movie)
        )


class MovieItem(Resource):
    """
        This class represents the movie item endpoints
        It contains the definition of a get, a put and a delete endpoint
    """
    @classmethod
    def get(cls, movie):
        """
            This method represents the get endpoint of this resource
            input:
                movie: the movie entry the URL parameter refers to
            output:
                the http response object containing either the movie with the given id
                or a 404 http error if no movie with this id exists
        """
        body = MasonBuilder(movie.serialize())
        body.add_control_get_movie(movie)
        body.add_control_update_movie(movie)
        body.add_control_delete_movie(movie)
        return get_blueprint(body)

    @classmethod
    def __update_movie_object(cls, movie, update_movie):
        update_movie.deserialize(request.json)

        movie.title = update_movie.title
        movie.director = update_movie.director
        movie.length = update_movie.length
        movie.release_date = update_movie.release_date
        movie.category_id = update_movie.category_id

    def put(self, movie):
        """
            This method represents the put endpoint of this resource,
            which is used to update a movie in the database
            It uses the blueprint function of the helper module
            input:
                movie: the old movie object which is to be updated
            output:
                a http response object representing the result of this operation
        """
        update_movie = Movie()
        return put_blueprint(
            request,
            get_movie_json_schema,
            api.DB,
            lambda: self.__update_movie_object(movie, update_movie)
        )

    @classmethod
    def delete(cls, movie):
        """
            This method represents the delete endpoint of this resource,
            which is used to remove a movie from the database
            It uses the blueprint function of the helper module
            input:
                movie: the movie object which is to be deleted
            output:
                a http response object representing the result of this operation
        """
        return delete_blueprint(api.DB, movie)
