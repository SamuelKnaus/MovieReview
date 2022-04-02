"""
    Contains helper functions to handle authentication for endpoints
"""
from functools import wraps

import requests
from flask import request

from constants import TOKEN_VALIDATION_ENDPOINT
from datamodels.user import UserType, User
from helper.error_response import ErrorResponse


from helper.third_component_request_helper import post_request


def __role_requirement_satisfied(role, required_role):
    return role == UserType.ADMIN or \
        role == UserType.BASIC_USER and required_role == UserType.BASIC_USER


def authorize(_func=None, *, required_role=UserType.BASIC_USER, return_authenticated_user=False):
    """
        This function represents the @authorize annotation
        It can be used as annotation for endpoints to authenticate a user and validate its role
        input:
            _func: the wrapper function
            required_role: an optional parameter representing the role
                which a user needs to have to use the endpoint
            return_authenticated_user: a flag indicating if the annotation should inject
                the authenticated user to the endpoint function or not
        return: rejects a request with an error response if the authentication or the authorization
            could not be validated, enters the endpoint function instead, if the
            return_authenticated_user flag was set, the user is injected as function parameter
    """
    def inner_token_required(func):
        @wraps(func)
        def wrapper_token_required(*args, **kwargs):
            token = None
            if 'Authorization' in request.headers:
                token = request.headers['Authorization']

            if not token:
                return ErrorResponse(
                    'The Authentication header is missing',
                    401
                ).get_http_response()

            # validate the token by using the third component
            body = {
                "token": token
            }
            try:
                response = post_request(TOKEN_VALIDATION_ENDPOINT, body)
            except requests.exceptions.ConnectionError:
                return ErrorResponse.get_unauthorized()

            # the token is invalid => forward the response
            if response.status_code == 401:
                return ErrorResponse(response.json(), response.status_code).get_http_response()
            # the token was valid, validate the role of the user
            if response.status_code == 200:
                user = User()
                user.deserialize(response.json())
                if __role_requirement_satisfied(user.role, required_role):
                    return func(*args, **kwargs, authenticated_user=user)\
                        if return_authenticated_user \
                        else func(*args, **kwargs)
                return ErrorResponse.get_forbidden()

            # default: return unauthorized
            return ErrorResponse.get_unauthorized()
        return wrapper_token_required

    if _func is None:
        return inner_token_required
    return inner_token_required(_func)
