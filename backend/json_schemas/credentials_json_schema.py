"""
    contains the credentials json schema for the login endpoint
"""


def get_credentials_json_schema():
    """
        returns the json schema of a credentials object
    """
    schema = {
        "type": "object",
        "required": ["username", "password"]
    }

    props = schema["properties"] = {}
    props["username"] = {
        "Username": "Title",
        "description": "The username",
        "type": "string"
    }
    props["password"] = {
        "title": "Password",
        "description": "The password",
        "type": "string"
    }
    return schema
