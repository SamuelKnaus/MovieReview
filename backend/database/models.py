"""
    Contains the database definition
"""

from datetime import date

import dateutil.tz
from dateutil import parser

import api
from constants import DATETIME_FORMAT
from helper.serializer import Serializer


class Movie(api.DB.Model, Serializer):
    """
    This class represents the database model of a movie
    """
    id = api.DB.Column(api.DB.Integer, primary_key=True, autoincrement=True)
    title = api.DB.Column(api.DB.String, nullable=False)
    director = api.DB.Column(api.DB.String, nullable=False)
    length = api.DB.Column(api.DB.Integer, nullable=False)
    release_date = api.DB.Column(api.DB.Date, nullable=False)
    category_id = api.DB.Column(
        api.DB.Integer,
        api.DB.ForeignKey("category.id", ondelete="RESTRICT"),
        nullable=False
    )

    category = api.DB.relationship("Category")
    reviews = api.DB.relationship("Review", cascade="delete", back_populates="movie")

    def serialize(self):
        """
            This function is used to transform a movie python object to its json representation
            It is used to encode the json body of requests responses
        """
        return {
            "id": self.id,
            "title": self.title,
            "director": self.director,
            "length": self.length,
            "release_date": self.release_date.isoformat(),
            "category_id": self.category_id
        }

    def deserialize(self, doc):
        """
        This function is used to transform a movie json object to an actual python object
        It is used to decode the json body of requests
        """
        self.title = doc["title"]
        self.director = doc.get("director")
        self.length = doc.get("length")
        self.release_date = date.fromisoformat(doc["release_date"])
        self.category_id = doc.get("category_id")


class Category(api.DB.Model, Serializer):
    """
        This class represents the database model of a category
    """
    id = api.DB.Column(api.DB.Integer, primary_key=True, autoincrement=True)
    title = api.DB.Column(api.DB.String, nullable=False)

    movies = api.DB.relationship("Movie", back_populates="category")

    def serialize(self):
        """
            This function is used to transform a category python object to its json representation
            It is used to encode the json body of requests responses
        """
        return {
            "id": self.id,
            "title": self.title
        }

    def deserialize(self, doc):
        """
            This function is used to transform a category json object to an actual python object
            It is used to decode the json body of requests
        """
        self.title = doc["title"]


class Review(api.DB.Model, Serializer):
    """
        This class represents the database model of a review
    """
    id = api.DB.Column(api.DB.Integer, primary_key=True, autoincrement=True)
    rating = api.DB.Column(api.DB.Integer, nullable=False)
    comment = api.DB.Column(api.DB.Text, nullable=False)
    date = api.DB.Column(api.DB.DateTime, nullable=False)
    author = api.DB.Column(
        api.DB.Integer,
        nullable=True
    )
    movie_id = api.DB.Column(
        api.DB.Integer,
        api.DB.ForeignKey("movie.id", ondelete="CASCADE"),
        nullable=False
    )

    movie = api.DB.relationship("Movie")

    def serialize(self):
        """
            This function is used to transform a review python object to its json representation
            It is used to encode the json body of requests responses
        """
        return {
            "id": self.id,
            "rating": self.rating,
            "comment": self.comment,
            "date": self.date.strftime(DATETIME_FORMAT),
            "author": self.author,
            "movie_id": self.movie_id
        }

    def deserialize(self, doc):
        """
            This function is used to transform a review json object to an actual python object
            It is used to decode the json body of requests
        """
        self.rating = doc["rating"]
        self.comment = doc.get("comment")
        self.date = parser.isoparse(doc["date"]).astimezone(dateutil.tz.UTC)
        self.author = doc.get("author")
        self.movie_id = doc.get("movie_id")
