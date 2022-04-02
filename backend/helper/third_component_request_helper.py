"""
    Contains the functions used for the communication with the third component (IdentityProvider)
"""

import json
import urllib

import requests
from flask import Response, request

from constants import THIRD_COMPONENT_URL
from helper.error_response import ErrorResponse

HEADERS = {
    "Content-Type": 'application/json'
}


def forward(original_request, mason_inject=None):
    """
        This method is used to forward requests and return the results like a proxy does
        input:
            original_request: The request that is to be made to the third component
            mason_inject: an optional function that is used to inject mason docu to the response
        output:
            A http response object representing the response of the third component
    """
    try:
        response = original_request()
    except requests.exceptions.ConnectionError:
        return ErrorResponse.get_gateway_timeout()

    status_code = response.status_code
    body = json.dumps(response.json())\
        if response.headers.get('content-type') == 'application/json'\
        else None
    if status_code < 300 and mason_inject is not None:
        body = mason_inject(json.loads(body))
    headers = response.headers.get('Location')
    if headers is not None:
        url = urllib.parse.urlparse(headers)
        headers = {"Location": request.scheme + '://' + request.host + url.path}

    return Response(
        body,
        status=status_code,
        mimetype=response.headers.get('content-type'),
        headers=headers
    )


def get_request(endpoint):
    """
        A helper function to make get requests to the third component
        input:
            endpoint: the resource path
        output: The response object
        exceptions:
            requests.exceptions.ConnectionError: In case the third component could not be reached
    """
    return requests.get(
        THIRD_COMPONENT_URL + endpoint,
        headers=HEADERS,
    )


def post_request(endpoint, body):
    """
        A helper function to make post requests to the third component
        input:
            endpoint: the resource path
            body: the body of the post request
        output: The response object
        exceptions:
            requests.exceptions.ConnectionError: In case the third component could not be reached
    """
    return requests.post(
        THIRD_COMPONENT_URL + endpoint,
        json.dumps(body),
        headers=HEADERS,
    )


def put_request(endpoint, body):
    """
        A helper function to make put requests to the third component
        input:
            endpoint: the resource path
            body: the body of the put request
        output: The response object
        exceptions:
            requests.exceptions.ConnectionError: In case the third component could not be reached
    """
    return requests.put(
        THIRD_COMPONENT_URL + endpoint,
        json.dumps(body),
        headers=HEADERS,
    )


def delete_request(endpoint):
    """
        A helper function to make post requests to the delete component
        input:
            endpoint: the resource path
        output: The response object
        exceptions:
            requests.exceptions.ConnectionError: In case the third component could not be reached
    """
    return requests.delete(
        THIRD_COMPONENT_URL + endpoint,
    )
