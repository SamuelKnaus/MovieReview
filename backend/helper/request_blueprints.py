from flask import Response
from jsonschema import validate, ValidationError, draft7_format_checker
from sqlalchemy import exc


def post_blueprint(request, json_schema, db, create_object):
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
        return Response("Unsupported media type", status=415)

    try:
        validate(request.json, json_schema(), format_checker=draft7_format_checker)
    except ValidationError as e:
        return Response(e.message, status=400)

    # here the actual object is created, using the method which is passed
    created_object = create_object()

    try:
        db.session.add(created_object)
        db.session.commit()
        return Response(status=201)
    except exc.IntegrityError as e:
        return Response(str(e.orig), status=409)


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
        return Response("Unsupported media type", status=415)

    try:
        validate(request.json, json_schema(), format_checker=draft7_format_checker)
    except ValidationError as e:
        return Response(e.message, status=400)

    # here the actual object is updated, using the method which is passed
    update_object()

    try:
        db.session.commit()
        return Response(status=204)
    except exc.IntegrityError as e:
        return Response(str(e.orig), status=409)


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
        return Response(str(e.orig), status=409)
