"""
    Contains all the url converters used in the api
"""

from werkzeug.exceptions import NotFound
from werkzeug.routing import BaseConverter

import database


class MovieConverter(BaseConverter):
    """
        This class represents the url converter model of a movie
    """

    def to_python(self, value):
        """
            This function converts the url parameter movie_id to the actual movie object
            input:
                value: the id of the movie, it represents the primary key of the database object
            output:
                The movie with the given id
            exceptions:
                NotFound: It is raised if there exists no movie with the given id
        """
        db_movie = database.models.Movie.query.filter_by(id=value).first()
        if db_movie is None:
            raise NotFound
        return db_movie

    def to_url(self, value):
        """
            This function converts the given movie object to its url parameter
            input:
                value: the movie object
            output:
                The id of the given movie as string
        """
        return str(value.id)


class CategoryConverter(BaseConverter):
    """
        This class represents the url converter model of a category
    """
    def to_python(self, value):
        """
        This function converts the url parameter category_id to the actual category object
        input:
            value: the id of the category, it represents the primary key of the database object
        output:
            The category with the given id
        exceptions:
            NotFound: It is raised if there exists no category with the given id
        """
        db_category = database.models.Category.query.filter_by(id=value).first()
        if db_category is None:
            raise NotFound
        return db_category

    def to_url(self, value):
        """
            This function converts the given category object to its url parameter
            input:
                value: the category object
            output:
                The id of the given category as string
        """
        return str(value.id)


class ReviewConverter(BaseConverter):
    """
        This class represents the url converter model of a review
    """
    def to_python(self, value):
        """
            This function converts the url parameter review_id to the actual review object
            input:
                value: the id of the review, it represents the primary key of the database object
            output:
                The review with the given id
            exceptions:
                NotFound: It is raised if there exists no review with the given id
        """
        db_review = database.models.Review.query.filter_by(id=value).first()
        if db_review is None:
            raise NotFound
        return db_review

    def to_url(self, value):
        """
            This function converts the given review object to its url parameter
            input:
                value: the review object
            output:
                The id of the given review as string
        """
        return str(value.id)
