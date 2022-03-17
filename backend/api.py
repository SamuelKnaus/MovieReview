"""
This module represents the whole api definition of the backend
All endpoints, the database models and the url converters are defined in here
"""

import enum
from datetime import date

from flask import Flask, request
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import event
from sqlalchemy.engine import Engine
from werkzeug.exceptions import NotFound
from werkzeug.routing import BaseConverter

from helper.request_blueprints import post_blueprint, put_blueprint, delete_blueprint
from helper.serializer import Serializer
from json_schemas.category_json_schema import get_category_json_schema
from json_schemas.movie_json_schema import get_movie_json_schema
from json_schemas.review_json_schema import get_review_json_schema
from json_schemas.user_json_schema import get_user_json_schema

APP = Flask(__name__)
APP.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///movie-review.db"
APP.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
APP.url_map.strict_slashes = False

API = Api(APP)
DB = SQLAlchemy(APP)


# Enable foreign key constraints for SQLite
@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, _connection_record):
    """
    This method is used to configure the foreign keys of the database
    """
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


# DATABASE MODEL
class UserType(str, enum.Enum):
    """
    This enum represents the possible roles for a user
    It is used to authorize the use of endpoints
    """
    admin = "Admin"
    basicUser = "Basic User"


class Movie(DB.Model, Serializer):
    """
    This class represents the database model of a movie
    """
    id = DB.Column(DB.Integer, primary_key=True, autoincrement=True)
    title = DB.Column(DB.String, nullable=False)
    director = DB.Column(DB.String, nullable=False)
    length = DB.Column(DB.Integer, nullable=False)
    release_date = DB.Column(DB.Date, nullable=False)
    category_id = DB.Column(
        DB.Integer,
        DB.ForeignKey("category.id", ondelete="RESTRICT"),
        nullable=False
    )

    category = DB.relationship("Category")
    reviews = DB.relationship("Review", cascade="delete", back_populates="movie")

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


class Category(DB.Model, Serializer):
    """
        This class represents the database model of a category
    """
    id = DB.Column(DB.Integer, primary_key=True, autoincrement=True)
    title = DB.Column(DB.String, nullable=False)

    movies = DB.relationship("Movie", back_populates="category")

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


class Review(DB.Model, Serializer):
    """
        This class represents the database model of a review
    """
    id = DB.Column(DB.Integer, primary_key=True, autoincrement=True)
    rating = DB.Column(DB.Integer, nullable=False)
    comment = DB.Column(DB.Text, nullable=False)
    date = DB.Column(DB.Date, nullable=False)
    author_id = DB.Column(DB.Integer, DB.ForeignKey("user.id", ondelete="SET NULL"), nullable=True)
    movie_id = DB.Column(DB.Integer, DB.ForeignKey("movie.id", ondelete="CASCADE"), nullable=False)

    movie = DB.relationship("Movie")
    user = DB.relationship("User")

    def serialize(self):
        """
            This function is used to transform a review python object to its json representation
            It is used to encode the json body of requests responses
        """
        return {
            "id": self.id,
            "rating": self.rating,
            "comment": self.comment,
            "date": self.date.isoformat(),
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
        self.date = date.fromisoformat(doc["date"])
        self.author_id = doc.get("author_id")
        self.movie_id = doc.get("movie_id")


class User(DB.Model, Serializer):
    """
        This class represents the database model of a user
    """
    id = DB.Column(DB.Integer, primary_key=True, autoincrement=True)
    username = DB.Column(DB.String, nullable=False, unique=True)
    email_address = DB.Column(DB.String, nullable=False, unique=True)
    password = DB.Column(DB.String, nullable=False)
    role = DB.Column(DB.Enum(UserType), nullable=False)

    review = DB.relationship("Review", back_populates="user")

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


# CONVERTERS
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
        db_category = Category.query.filter_by(id=value).first()
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
        db_movie = Movie.query.filter_by(id=value).first()
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
        db_review = Review.query.filter_by(id=value).first()
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


class UserConverter(BaseConverter):
    """
        This class represents the url converter model of a user
    """
    def to_python(self, value):
        """
            This function converts the url parameter user_id to the actual user object
            input:
                value: the id of the user, it represents the primary key of the database object
            output:
                The user with the given id
            exceptions:
                NotFound: It is raised if there exists no user with the given id
        """
        db_user = User.query.filter_by(id=value).first()
        if db_user is None:
            raise NotFound
        return db_user

    def to_url(self, value):
        """
            This function converts the given user object to its url parameter
            input:
                value: the user object
            output:
                The id of the given user as string
        """
        return str(value.id)


# CATEGORY LOGIC
class CategoryCollection(Resource):
    """
        This class represents the category collection endpoints
        It contains the definition of a get and a post endpoint
    """

    @classmethod
    def get(cls):
        """
            This method represents the get endpoint of this resource
            output:
                the http response object containing either the list of categories
                or a http error with the corresponding error message
        """
        categories = Category.query.all()
        categories = Category.serialize_list(categories)
        return categories, 200

    @classmethod
    def __create_category_object(cls, created_category):
        created_category.deserialize(request.json)
        return created_category

    def post(self):
        """
            This method represents the post endpoint of this resource,
            which is used to add a new category to the database
            It uses the blueprint function of the helper module
            output:
                a http response object representing the result of this operation
        """
        category = Category()
        return post_blueprint(
            request,
            get_category_json_schema,
            DB,
            lambda: self.__create_category_object(category)
        )


API.add_resource(CategoryCollection, "/api/categories/")


class CategoryItem(Resource):
    """
        This class represents the category item endpoints
        It contains the definition of a get, a put and a delete endpoint
    """
    @classmethod
    def get(cls, category):
        """
            This method represents the get endpoint of this resource
            input:
                category: the category entry the URL parameter refers to
            output:
                the http response object containing either the category with the given id
                or a 404 http error if no movie with this id exists
        """
        return category.serialize()

    @classmethod
    def __update_category_object(cls, category, update_category):
        update_category.deserialize(request.json)

        category.title = update_category.title

    def put(self, category):
        """
            This method represents the put endpoint of this resource,
            which is used to update a category in the database
            It uses the blueprint function of the helper module
            input:
                category: the old category object which is to be updated
            output:
                a http response object representing the result of this operation
        """
        update_category = Category()
        return put_blueprint(request, get_category_json_schema, DB,
                             lambda: self.__update_category_object(category, update_category))

    @classmethod
    def delete(cls, category):
        """
            This method represents the delete endpoint of this resource,
            which is used to remove a category from the database
            It uses the blueprint function of the helper module
            input:
                category: the category object which is to be deleted
            output:
                a http response object representing the result of this operation
        """
        return delete_blueprint(DB, category)


APP.url_map.converters["category"] = CategoryConverter
API.add_resource(CategoryItem, "/api/categories/<category:category>/")


# MOVIE LOGIC
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
        movies = Category.serialize_list(movies)
        return movies, 200

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
            DB,
            lambda: self.__create_movie_object(movie)
        )


API.add_resource(MovieCollection, "/api/movies/")


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
        return movie.serialize()

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
            DB,
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
        return delete_blueprint(DB, movie)


APP.url_map.converters["movie"] = MovieConverter
API.add_resource(MovieItem, "/api/movies/<movie:movie>/")


# REVIEW LOGIC
class MovieReviewCollection(Resource):
    """
        This class represents the movie review collection endpoints
        ALl endpoints in this class are out of the perspective of a movie,
        so the reviews belong to/are written for one specific movie
        It contains the definition of a get and a post endpoint
    """
    @classmethod
    def get(cls, movie):
        """
            This method represents the get endpoint of this resource
            input:
                movie: the movie which the reviews have been requested for
            output:
                the http response object containing either the list of reviews of this movie
                or a http error with the corresponding error message
        """
        movies = Review.query.filter_by(movie_id=movie.id).all()
        movies = Category.serialize_list(movies)
        return movies, 200

    @classmethod
    def __create_review_object(cls, movie, created_review):
        created_review.deserialize(request.json)
        # ignore the foreign key and set it to the parameter given in the url
        created_review.movie_id = movie.id
        return created_review

    def post(self, movie):
        """
            This method represents the post endpoint of this resource,
            which is used to add a new review for the given movie to the database
            It uses the blueprint function of the helper module
            input:
                movie: the movie which this review is associated to
            output:
                a http response object representing the result of this operation
        """
        review = Review()
        return post_blueprint(
            request,
            get_review_json_schema,
            DB,
            lambda: self.__create_review_object(movie, review)
        )


API.add_resource(MovieReviewCollection, "/api/movies/<movie:movie>/reviews/")


class MovieReviewItem(Resource):
    """
        This class represents the movie review item endpoints
        It contains the definition of a get, a put and a delete endpoint
    """
    @classmethod
    def get(cls, _movie, review):
        """
            This method represents the get endpoint of this resource
            input:
                _movie: the movie, this review has been written for
                review: the review, the url parameter refers to
            output:
                the http response object containing either the review with the given id
                for the movie with the given id
                or a 404 http error if no movie or no review with the given id exists
        """
        return review.serialize()

    @classmethod
    def __update_review_object(cls, review, update_review):
        update_review.deserialize(request.json)

        review.rating = update_review.rating
        review.comment = update_review.comment
        review.date = update_review.date
        review.author_id = update_review.author_id
        review.movie_id = update_review.movie_id

    def put(self, _movie, review):
        """
            This method represents the put endpoint of this resource,
            which is used to update the review of a movie in the database
            It uses the blueprint function of the helper module
            input:
                _movie: the movie, this review was written for
                review: the old review object which is to be updated
            output:
                a http response object representing the result of this operation
        """
        update_review = Review()
        return put_blueprint(request, get_review_json_schema, DB,
                             lambda: self.__update_review_object(review, update_review))

    @classmethod
    def delete(cls, _movie, review):
        """
            This method represents the delete endpoint of this resource,
            which is used to remove a review of a certain movie from the database
            It uses the blueprint function of the helper module
            input:
                _movie: the movie, this review was written for
                review: the review object which is to be deleted
            output:
                a http response object representing the result of this operation
        """
        return delete_blueprint(DB, review)


APP.url_map.converters["review"] = ReviewConverter
API.add_resource(MovieReviewItem, "/api/movies/<movie:movie>/reviews/<review:review>")


# USERS LOGIC
class UserCollection(Resource):
    """
        This class represents the user collection endpoints
        It contains the definition of a get and a post endpoint
    """
    @classmethod
    def get(cls):
        """
            This method represents the get endpoint of this resource
            output:
                the http response object containing either the list of users
                or a http error with the corresponding error message
        """
        users = User.query.all()
        users = User.serialize_list(users)
        return users, 200

    @classmethod
    def __create_user_object(cls, created_user):
        created_user.deserialize(request.json)
        return created_user

    def post(self):
        """
            This method represents the post endpoint of this resource,
            which is used to add a new user to the database
            It uses the blueprint function of the helper module
            output:
                a http response object representing the result of this operation
        """
        user = User()
        return post_blueprint(
            request,
            get_user_json_schema,
            DB,
            lambda: self.__create_user_object(user)
        )


API.add_resource(UserCollection, "/api/users/")


class UserItem(Resource):
    """
        This class represents the user item endpoints
        It contains the definition of a get, a put and a delete endpoint
    """
    @classmethod
    def get(cls, user):
        """
            This method represents the get endpoint of this resource
            input:
                user: the user, the url parameter refers to
            output:
                the http response object containing either the user with the given id
                or a 404 http error if no user with the given id exists
        """
        return user.serialize()

    @classmethod
    def __update_review_object(cls, user, update_user):
        update_user.deserialize(request.json)

        user.username = update_user.username
        user.email_address = update_user.email_address
        user.password = update_user.password
        user.role = update_user.role

    def put(self, user):
        """
            This method represents the put endpoint of this resource,
            which is used to update a user in the database
            It uses the blueprint function of the helper module
            input:
                user: the old user object which is to be updated
            output:
                a http response object representing the result of this operation
        """
        update_user = User()
        return put_blueprint(
            request,
            get_user_json_schema,
            DB,
            lambda: self.__update_review_object(user, update_user)
        )

    @classmethod
    def delete(cls, user):
        """
            This method represents the delete endpoint of this resource,
            which is used to remove a user from the database
            It uses the blueprint function of the helper module
            input:
                user: the user object which is to be deleted
            output:
                a http response object representing the result of this operation
        """
        return delete_blueprint(DB, user)


APP.url_map.converters["user"] = UserConverter
API.add_resource(UserItem, "/api/users/<user:user>/")


# pylint: disable=too-few-public-methods
class UserReviewCollection(Resource):
    """
        This class represents the user review collection endpoints
        ALl endpoints in this class are out of the perspective of a user,
        so the reviews belong to/are written by one specific user
        It contains the definition of a get endpoint only
        To add new reviews you have to use the MovieReviewCollection endpoints
    """
    @classmethod
    def get(cls, user):
        """
            This method represents the get endpoint of this resource
            input:
                user: the user, who wrote the reviews
            output:
                the http response object containing either the list of reviews written by this
                user or a http error with the corresponding error message
        """
        reviews = Review.query.filter_by(author_id=user.id).all()
        reviews = Review.serialize_list(reviews)
        return reviews, 200


API.add_resource(UserReviewCollection, "/api/users/<user:user>/reviews/")
