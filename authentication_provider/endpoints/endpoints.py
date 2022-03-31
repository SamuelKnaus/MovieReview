"""
    All the endpoints for the user resources
"""
import werkzeug
from flask import request
from flask_restful import Resource


import api

from database.models import User
from helper.encryption_helper import EncryptionHelper
from helper.request_blueprints import get_blueprint, put_blueprint, delete_blueprint, post_blueprint


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
        users = User().serialize_list(users)
        return get_blueprint(users)

    @classmethod
    def __create_user_object(cls, created_user):
        created_user.deserialize(request.json)
        return created_user

    @classmethod
    def __get_url_for_created_item(cls, user):
        user.password = EncryptionHelper.encrypt_password(user.password)
        return api.API.url_for(UserItem, user=user)

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
            User.json_schema,
            api.DB,
            lambda: self.__create_user_object(user),
            lambda: self.__get_url_for_created_item(user)
        )


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
        return get_blueprint(user.serialize())

    @classmethod
    def __update_review_object(cls, user, update_user):
        update_user.deserialize(request.json)

        if user.username != update_user.username:
            raise werkzeug.exceptions.BadRequest("The username cannot be changed")

        user.email_address = update_user.email_address
        user.password = EncryptionHelper.encrypt_password(update_user.password)
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
            User.json_schema,
            api.DB,
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
        return delete_blueprint(api.DB, user)
