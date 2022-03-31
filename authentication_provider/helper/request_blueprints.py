"""
    http request helper module which contains blueprints for http methods
"""

import json

from flask import Response
from jsonschema import validate, ValidationError, draft7_format_checker
from sqlalchemy import exc

from constants import DATA_TYPE_JSON
from helper.error_response import ErrorResponse


def get_blueprint(response_object):
    """
        This method is used to make get http requests, which return objects from the database.
        It acts as a blueprint to enable a similar behaviour for all get endpoints
        input:
            request: The response content as json string, which is sent back
        output:
            a http response object
    """
    return Response(json.dumps(response_object), 200, mimetype=DATA_TYPE_JSON)


def post_blueprint(request, json_schema, db, create_object, get_new_resource_url):
    """
    This method is used to make post http requests, which add objects to the database.
    It acts as a blueprint to enable a similar behaviour for all post endpoints
    input:
        request: The request object, which is sent
        json_schema: The json schema, which the request body is validated against
        db: a database object, which is used to persist changes
        create_object: a method which creates the object that is to be added to the database
    output:
        a http response object
    """
    if not request.json:
        return ErrorResponse.get_unsupported_media_type()

    try:
        validate(request.json, json_schema(), format_checker=draft7_format_checker)
    except ValidationError as e:
        return ErrorResponse(e.message, 400).get_http_response()

    # here the actual object is created, using the method which is passed
    created_object = create_object()

    try:
        db.session.add(created_object)
        db.session.commit()
        headers = {"Location": get_new_resource_url()}
        return Response(headers=headers, status=201)
    except exc.IntegrityError as e:
        return ErrorResponse(str(e.orig), 409).get_http_response()


def put_blueprint(request, json_schema, db, update_object):
    """
    This method is used to make put http requests, which update objects in the database.
    It acts as a blueprint to enable a similar behaviour for all put endpoints
    input:
        request: The request object, which is sent
        json_schema: The json schema, which the request body is validated against
        db: a database object, which is used to persist changes
        create_object: a method which creates the updated object that is then used to
            overwrite the original object in the database
    output:
        a http response object
    """
    if not request.json:
        return ErrorResponse.get_unsupported_media_type()

    try:
        validate(request.json, json_schema(), format_checker=draft7_format_checker)
    except ValidationError as e:
        return ErrorResponse(e.message, 400).get_http_response()

    # here the actual object is updated, using the method which is passed
    update_object()

    try:
        db.session.commit()
        return Response(status=204)
    except exc.IntegrityError as e:
        return ErrorResponse(str(e.orig), 409).get_http_response()


def delete_blueprint(db, object_to_delete):
    """
    This method is used to make delete http requests, which add objects to the database.
    It acts as a blueprint to enable a similar behaviour for all delete endpoints
    input:
        db: a database object, which is used to persist changes
        object: the object, which is to be removed
    output:
        a http response object
    """
    try:
        db.session.delete(object_to_delete)
        db.session.commit()
        return Response(status=204)
    except exc.IntegrityError as e:
        return ErrorResponse(str(e.orig), 409).get_http_response()
