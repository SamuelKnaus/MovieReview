"""
    Contains all endpoints that are used for the authentication
"""
import json

import jwt
from flask import request, Response
from flask_restful import Resource
from jsonschema import validate, ValidationError, draft7_format_checker

from constants import DATA_TYPE_JSON
from endpoints.models.authentication_token import AuthenticationToken
from endpoints.models.credentials import Credentials
from helper.encryption_helper import EncryptionHelper
from helper.error_response import ErrorResponse
from helper.jwt_helper import JWTHelper
import database


class Login(Resource):
    """
        Contains the login functionality
    """
    @classmethod
    def post(cls):
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

        if user is None or not EncryptionHelper.check_password(credentials.password, user.password):
            return ErrorResponse.get_unauthorized()

        token = AuthenticationToken(JWTHelper.create_token(user.username))
        return Response(json.dumps(token.serialize()), status=200, mimetype=DATA_TYPE_JSON)


class TokenValidator(Resource):
    """
        Contains the token endpoints
    """
    @classmethod
    def post(cls):
        """
            Validates a given authentication token
            return: An http response indicating the result of the validation
        """
        if not request.json:
            return ErrorResponse.get_unsupported_media_type()

        try:
            validate(
                request.json,
                AuthenticationToken.json_schema(),
                format_checker=draft7_format_checker
            )
        except ValidationError as e:
            return ErrorResponse(e.message, 400).get_http_response()

        authentication_token = AuthenticationToken()
        authentication_token.deserialize(request.json)

        try:
            token_payload = JWTHelper.check_token_validity(authentication_token.token)
        except jwt.ExpiredSignatureError:
            return ErrorResponse("Token expired. Get new one", status_code=401).get_http_response()
        except jwt.InvalidTokenError:
            return ErrorResponse("Invalid Token", status_code=401).get_http_response()

        username = token_payload['iss']
        user = database.models.User.query.filter_by(username=username).first()

        if user is not None:
            return Response(json.dumps(user.serialize()), status=200, mimetype=DATA_TYPE_JSON)

        return ErrorResponse.get_unauthorized()
