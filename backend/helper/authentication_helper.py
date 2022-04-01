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


def authorize(_func=None, *, required_role=UserType.BASIC_USER):
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
                r = post_request(TOKEN_VALIDATION_ENDPOINT, body)
            except requests.exceptions.ConnectionError:
                return ErrorResponse.get_unauthorized()

            # the token is invalid => forward the response
            if r.status_code == 401:
                return ErrorResponse(r.json(), r.status_code).get_http_response()
            # the token was valid, validate the role of the user
            elif r.status_code == 200:
                user = User()
                user.deserialize(r.json())
                if __role_requirement_satisfied(user.role, required_role):
                    return func(*args, **kwargs)
                else:
                    return ErrorResponse.get_forbidden()
    
            # default: return unauthorized
            return ErrorResponse.get_unauthorized()
        return wrapper_token_required

    if _func is None:
        return inner_token_required
    else:
        return inner_token_required(_func)
