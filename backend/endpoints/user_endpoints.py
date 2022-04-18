"""
    All the endpoints for the user resources
"""
import json

import werkzeug
from flask import request
from flask_restful import Resource

from datamodels.user import UserType
from helper.authentication_helper import authorize
from helper.request_blueprints import get_blueprint
from helper.third_component_request_helper import get_request, forward, post_request, put_request, \
    delete_request
from mason.mason_builder import MasonBuilder


class UserCollection(Resource):
    """
        This class represents the user collection endpoints
        It contains the definition of a get and a post endpoint
    """
    @classmethod
    def __inject_mason(cls, user_list_json):
        user_items = []
        for user in user_list_json:
            item = MasonBuilder(user)
            item.add_control_get_user(user['username'])
            user_items.append(item)

        body = MasonBuilder()
        body.add_api_namespace()
        body.add_control_view_function()
        body.add_control_get_users("self")
        body.add_control_post_user()
        body["items"] = user_items
        return json.dumps(body)

    @authorize(required_role=UserType.ADMIN)
    def get(self):
        """
            This method represents the get endpoint of this resource
            output:
                the http response object containing either the list of users
                or a http error with the corresponding error message
        """
        return forward(
            lambda: get_request("/api/users"),
            lambda user: self.__inject_mason(user)
        )

    @classmethod
    def post(cls):
        """
            This method represents the post endpoint of this resource,
            which is used to add a new user to the database
            It uses the blueprint function of the helper module
            output:
                a http response object representing the result of this operation
        """
        return forward(lambda: post_request(request.path, request.json))


class UserItem(Resource):
    """
        This class represents the user item endpoints
        It contains the definition of a get, a put and a delete endpoint
    """
    @classmethod
    def __inject_mason(cls, user_json):
        body = MasonBuilder(user_json)
        body.add_api_namespace()
        body.add_control_get_users("collection")
        body.add_control_get_user(user_json['username'])
        body.add_control_update_user(user_json['username'])
        body.add_control_delete_user(user_json['username'])
        body.add_control_get_reviews_of_user(user_json['username'])
        return json.dumps(body)

    @authorize(return_authenticated_user=True)
    def get(self, username, authenticated_user):
        """
            This method represents the get endpoint of this resource
            input:
                user: the user, the url parameter refers to
            output:
                the http response object containing either the user with the given id
                or a 404 http error if no user with the given id exists
            exceptions:
                werkzeug.exceptions.Forbidden: Thrown if a non-admin user tries to see the
                    profile of another user
        """
        if authenticated_user.username != username and \
                not authenticated_user.role == UserType.ADMIN:
            raise werkzeug.exceptions.Forbidden(
                "You are not authorized to see the profile of another user"
            )

        response = forward(
            lambda: get_request(request.path),
            lambda user_json: self.__inject_mason(user_json)
        )
        return response

    @classmethod
    @authorize(return_authenticated_user=True)
    def put(cls, username, authenticated_user):
        """
            This method represents the put endpoint of this resource,
            which is used to update a user in the database
            It uses the blueprint function of the helper module
            input:
                user: the old user object which is to be updated
            output:
                a http response object representing the result of this operation
            exceptions:
                werkzeug.exceptions.Forbidden: Thrown if a non-admin user tries to edit the
                    profile of another user
        """
        if authenticated_user.username != username and \
                not authenticated_user.role == UserType.ADMIN:
            raise werkzeug.exceptions.Forbidden(
                "You are not authorized to edit the profile of another user"
            )

        return forward(lambda: put_request(request.path, request.json))

    @classmethod
    @authorize(return_authenticated_user=True)
    def delete(cls, username, authenticated_user):
        """
            This method represents the delete endpoint of this resource,
            which is used to remove a user from the database
            It uses the blueprint function of the helper module
            input:
                user: the user object which is to be deleted
            output:
                a http response object representing the result of this operation
            exceptions:
                werkzeug.exceptions.Forbidden: Thrown if a non-admin user tries to delete the
                    profile of another user
        """
        if authenticated_user.username != username and \
                not authenticated_user.role == UserType.ADMIN:
            raise werkzeug.exceptions.Forbidden(
                "You are not authorized to delete the profile of another user"
            )

        return forward(lambda: delete_request(request.path))


class AuthenticatedUserItem(Resource):
    """
        This class represents the authenticated user item endpoints
        It contains the definition of a single get endpoint
    """

    @classmethod
    @authorize(return_authenticated_user=True)
    def get(cls, authenticated_user):
        """
            This method represents the get endpoint of this resource
            input:
                authenticated_user: the currently authenticated user injected
                    by the authentication helper
            output:
                the http response object containing the currently authenticated user
        """
        body = MasonBuilder(authenticated_user.serialize())
        body.add_control_view_function()
        body.add_control_get_user(authenticated_user.username)
        body.add_control_get_reviews_of_user(authenticated_user.username)
        return get_blueprint(body)
