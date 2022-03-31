"""
This module represents the whole api definition of the backend
All endpoints, the database models and the url converters are defined in here
"""

from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy

from endpoints.authentication_endpoints import Login, TokenValidator, Logout
from url_converter.user_converter import UserConverter

APP = Flask(__name__, static_folder="static")
CORS(APP)
APP.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///user.db"
APP.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
APP.url_map.strict_slashes = False

API = Api(APP)
DB = SQLAlchemy(APP)


from endpoints.user_endpoints import UserCollection, UserItem


API.add_resource(UserCollection, "/api/users/")
APP.url_map.converters["user"] = UserConverter
API.add_resource(UserItem, "/api/users/<user:user>/")

API.add_resource(Login, "/login")
API.add_resource(Logout, "/logout")
API.add_resource(TokenValidator, "/validateToken")
