"""
    All the endpoints for the user resources
"""

from flask import request
from flask_restful import Resource
from helper.third_component_request_helper import get_request, forward, post_request, put_request, \
    delete_request


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
        return forward(lambda: get_request("/api/users"))

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
    def get(cls, _username):
        """
            This method represents the get endpoint of this resource
            input:
                user: the user, the url parameter refers to
            output:
                the http response object containing either the user with the given id
                or a 404 http error if no user with the given id exists
        """
        return forward(lambda: get_request(request.path))

    @classmethod
    def put(cls, _username):
        """
            This method represents the put endpoint of this resource,
            which is used to update a user in the database
            It uses the blueprint function of the helper module
            input:
                user: the old user object which is to be updated
            output:
                a http response object representing the result of this operation
        """
        return forward(lambda: put_request(request.path, request.json))

    @classmethod
    def delete(cls, _username):
        """
            This method represents the delete endpoint of this resource,
            which is used to remove a user from the database
            It uses the blueprint function of the helper module
            input:
                user: the user object which is to be deleted
            output:
                a http response object representing the result of this operation
        """
        return forward(lambda: delete_request(request.path))
