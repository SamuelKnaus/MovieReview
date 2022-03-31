"""
    Contains all endpoints that are used for the authentication
"""
import json

from flask import request, Response
from flask_restful import Resource
from jsonschema import validate, ValidationError, draft7_format_checker

from constants import DATA_TYPE_JSON
from endpoints.models.authentication_token import AuthenticationToken
from endpoints.models.credentials import Credentials
from helper.encryption_helper import EncryptionHelper
from helper.error_response import ErrorResponse
import database


class Login(Resource):
    """
        Contains the login functionality
    """
    def post(self):
        """
            Validates the given user data
            return: An http response indicating the result of the login
        """
        if not request.json:
            return ErrorResponse.get_unsupported_media_type()

        try:
            validate(request.json, Credentials.json_schema(), format_checker=draft7_format_checker)
        except ValidationError as e:
            return ErrorResponse(e.message, 400).get_http_response()

        credentials = Credentials()
        credentials.deserialize(request.json)

        user = database.models.User.query.filter_by(username=credentials.username).first()

        # TODO create token
        token = AuthenticationToken('')

        if EncryptionHelper.check_password(credentials.password, user.password):
            return Response(json.dumps(token.serialize()), status=200, mimetype=DATA_TYPE_JSON)
        return ErrorResponse.get_unauthorized()


class Logout(Resource):
    """
        Contains the logout functionality
    """
    def get(self):
        """
            Represents the logout endpoint
            return: An http response indicating the result of the logout
        """
        return ''


class TokenValidator(Resource):
    """
        Contains the token endpoints
    """
    def post(self):
        """
            Validates a given authentication token
            return: An http response indicating the result of the validation
        """
        return ''
