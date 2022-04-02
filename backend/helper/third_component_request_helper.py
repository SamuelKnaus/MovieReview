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
    return requests.get(
        THIRD_COMPONENT_URL + endpoint,
        headers=HEADERS,
    )


def post_request(endpoint, body):
    return requests.post(
        THIRD_COMPONENT_URL + endpoint,
        json.dumps(body),
        headers=HEADERS,
    )


def put_request(endpoint, body):
    return requests.put(
        THIRD_COMPONENT_URL + endpoint,
        json.dumps(body),
        headers=HEADERS,
    )


def delete_request(endpoint):
    return requests.delete(
        THIRD_COMPONENT_URL + endpoint,
    )
