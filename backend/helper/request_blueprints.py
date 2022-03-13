from jsonschema import validate, ValidationError, draft7_format_checker
from sqlalchemy import exc


'''
This method is used to make post http requests, which add objects to the database.
It acts as a blueprint to enable a similar behaviour for all post endpoints
input:
    request: The request object, which is sent
    json_schema: The json schema, which the request body is validated against
    db: a database object, which is used to persist changes
    create_object: a method which creates the object that is to be added to the database
'''
def post_blueprint(request, json_schema, db, create_object):
    if not request.json:
        return "Unsupported media type", 415

    try:
        validate(request.json, json_schema(), format_checker=draft7_format_checker)
    except ValidationError as e:
        return e.message, 400

    # here the actual object is created, using the method which is passed
    created_object = create_object()

    try:
        db.session.add(created_object)
        db.session.commit()
        return "", 201
    except exc.IntegrityError as e:
        return str(e.orig), 409


'''
This method is used to make put http requests, which update objects in the database.
It acts as a blueprint to enable a similar behaviour for all put endpoints
input:
    request: The request object, which is sent
    json_schema: The json schema, which the request body is validated against
    db: a database object, which is used to persist changes
    create_object: a method which creates the updated object that is then used to overwrite the original object in the database
'''
def put_blueprint(request, json_schema, db, update_object):
    if not request.json:
        return "Unsupported media type", 415

    try:
        validate(request.json, json_schema(), format_checker=draft7_format_checker)
    except ValidationError as e:
        return e.message, 400

    # here the actual object is updated, using the method which is passed
    update_object()

    try:
        db.session.commit()
    except exc.IntegrityError as e:
        return str(e.orig), 409

    return "", 204


'''
This method is used to make delete http requests, which add objects to the database.
It acts as a blueprint to enable a similar behaviour for all delete endpoints
input:
    db: a database object, which is used to persist changes
    object: the object, which is to be removed
'''
def delete_blueprint(db, object):
    try:
        db.session.delete(object)
        db.session.commit()
        return "", 204
    except exc.IntegrityError as e:
        return str(e.orig), 409
