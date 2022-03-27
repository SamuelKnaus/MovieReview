"""
    Contains the database definition
"""

import enum
from datetime import date
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


class UserType(str, enum.Enum):
    """
    This enum represents the possible roles for a user
    It is used to authorize the use of endpoints
    """
    ADMIN = "Admin"
    BASIC_USER = "Basic User"


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
    author_id = api.DB.Column(
        api.DB.Integer,
        api.DB.ForeignKey("user.id", ondelete="SET NULL"),
        nullable=True
    )
    movie_id = api.DB.Column(
        api.DB.Integer,
        api.DB.ForeignKey("movie.id", ondelete="CASCADE"),
        nullable=False
    )

    movie = api.DB.relationship("Movie")
    user = api.DB.relationship("User")

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
            "author_id": self.author_id,
            "movie_id": self.movie_id
        }

    def deserialize(self, doc):
        """
            This function is used to transform a review json object to an actual python object
            It is used to decode the json body of requests
        """
        self.rating = doc["rating"]
        self.comment = doc.get("comment")
        self.date = parser.isoparse(doc["date"])
        self.author_id = doc.get("author_id")
        self.movie_id = doc.get("movie_id")


class User(api.DB.Model, Serializer):
    """
        This class represents the database model of a user
    """
    id = api.DB.Column(api.DB.Integer, primary_key=True, autoincrement=True)
    username = api.DB.Column(api.DB.String, nullable=False, unique=True)
    email_address = api.DB.Column(api.DB.String, nullable=False, unique=True)
    password = api.DB.Column(api.DB.String, nullable=False)
    role = api.DB.Column(api.DB.Enum(UserType), nullable=False)

    review = api.DB.relationship("Review", back_populates="user")

    def serialize(self):
        """
            This function is used to transform a user python object to its json representation
            It is used to encode the json body of requests responses
        """
        return {
            "id": self.id,
            "username": self.username,
            "email_address": self.email_address,
            "role": self.role
        }

    def deserialize(self, doc):
        """
            This function is used to transform a user json object to an actual python object
            It is used to decode the json body of requests
        """
        self.username = doc["username"]
        self.email_address = doc.get("email_address")
        self.password = doc.get("password")
        self.role = doc.get("role")
