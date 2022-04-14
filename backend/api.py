"""
This module represents the whole api definition of the backend
All endpoints, the database models and the url converters are defined in here
"""
from flasgger import Swagger
from flask import Flask, send_from_directory
from flask_caching import Cache
from flask_cors import CORS
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import event
from sqlalchemy.engine import Engine

from constants import NAMESPACE_LINK, CACHING_TIMEOUT
from mason.mason_builder import MasonBuilder
from url_converters.url_converter import CategoryConverter, MovieConverter
from url_converters.url_converter import ReviewConverter

APP = Flask(__name__, static_folder="static")
CORS(APP)
APP.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///movie-review.db"
APP.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
APP.config["CACHE_TYPE"] = "SimpleCache"
APP.config["CACHE_DEFAULT_TIMEOUT"]: CACHING_TIMEOUT
APP.config["SWAGGER"] = {
    "title": "Movie Review OpenAPI Documentation",
    "openapi": "3.0.3",
    "uiversion": 3,
}
APP.url_map.strict_slashes = False

API = Api(APP)
DB = SQLAlchemy(APP)
CACHE = Cache(APP)
Swagger(APP, template_file=APP.static_folder + "/api_documentation.yml")

from endpoints.movie_endpoints import MovieCollection, MovieItem
from endpoints.user_endpoints import UserCollection, UserItem, AuthenticatedUserItem
from endpoints.review_endpoints import UserReviewCollection, MovieReviewCollection, MovieReviewItem
from endpoints.category_endpoints import CategoryCollection, CategoryItem


@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, _connection_record):
    """
    This method is used to configure the foreign keys of the database
    This method is used to configure the foreign keys of the database
    """
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


# CATEGORY LOGIC
API.add_resource(CategoryCollection, "/api/categories/")
APP.url_map.converters["category"] = CategoryConverter
API.add_resource(CategoryItem, "/api/categories/<category:category>/")


# MOVIE LOGIC
API.add_resource(MovieCollection, "/api/movies/")
APP.url_map.converters["movie"] = MovieConverter
API.add_resource(MovieItem, "/api/movies/<movie:movie>/")


# REVIEW LOGIC
API.add_resource(MovieReviewCollection, "/api/movies/<movie:movie>/reviews/")
APP.url_map.converters["review"] = ReviewConverter
API.add_resource(MovieReviewItem, "/api/movies/<movie:movie>/reviews/<review:review>/")


# USERS LOGIC
API.add_resource(UserCollection, "/api/users/")
API.add_resource(UserItem, "/api/users/<_username>/")

API.add_resource(UserReviewCollection, "/api/users/<username>/reviews/")

# CURRENT USER LOGIC
API.add_resource(AuthenticatedUserItem, "/api/current-user/")


@APP.route(NAMESPACE_LINK)
def send_link_relations_html():
    """
        returns the static html file containing the link relations
    """
    return send_from_directory(APP.static_folder, "link-relations.html")


@APP.route("/")
def index():
    """
        This is the view function of the api
        It returns a http response containing a description of the api
    """
    body = MasonBuilder()
    body.add_api_namespace()

    body.add_control_get_authenticated_user()
    body.add_control_login()

    body.add_control_get_categories()
    body.add_control_post_category()

    body.add_control_get_movies()
    body.add_control_post_movie()

    body.add_control_get_users()
    body.add_control_post_user()
    return body
