"""
    The movie mason builder class
"""
import api
from json_schemas.movie_json_schema import get_movie_json_schema
from mason.generic_mason_builder import GenericMasonBuilder


class MovieMasonBuilder(GenericMasonBuilder):
    """
        The mason builder which is responsible for all movie endpoints
    """
    def __init__(self):
        self.api = api.API
        self.movie_item = api.MovieItem
        self.movie_collection = api.MovieCollection

    def add_control_get_movies(self):
        """
            This method adds the mason documentation for the get all movies endpoint
        """
        self._add_control(
            "movies-get",
            title="Get a list of all movies",
            href=self.api.url_for(self.movie_collection)
        )

    def add_control_post_movie(self):
        """
            This method adds the mason documentation for the post a new movie endpoint
        """
        self._add_control_post(
            "movies-post",
            title="Create a new movie",
            href=self.api.url_for(self.movie_collection),
            schema=get_movie_json_schema()
        )

    def add_control_get_movie(self, movie):
        """
            This method adds the mason documentation for the get a single movie endpoint
        """
        self._add_control(
            "self",
            title="Get a single movie",
            href=self.api.url_for(
                self.movie_item,
                movie=movie
            )
        )

    def add_control_update_movie(self, movie):
        """
            This method adds the mason documentation for the update an existing movie endpoint
        """
        self._add_control_put(
            "edit",
            title="Update a movie",
            href=self.api.url_for(
                self.movie_item,
                movie=movie
            ),
            schema=get_movie_json_schema()
        )

    def add_control_delete_movie(self, movie):
        """
            This method adds the mason documentation for the delete a movie endpoint
        """
        self._add_control_delete(
            "delete",
            title="Delete a movie",
            href=self.api.url_for(
                self.movie_item,
                movie=movie
            )
        )
