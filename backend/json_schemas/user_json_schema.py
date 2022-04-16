"""
    contains the user json schema
"""


def get_user_json_schema():
    """
        returns the json schema of a user object
    """
    schema = {
        "type": "object",
        "required": ["username", "email_address", "password", "role"]
    }

    props = schema["properties"] = {}
    props["username"] = {
        "title": "Username",
        "description": "The username of the user",
        "type": "string"
    }
    props["email_address"] = {
        "title": "Email address",
        "description": "The email address of the user",
        "type": "string",
        "format": "email"
    }
    props["password"] = {
        "title": "Password",
        "description": "The password of the user",
        "type": "string",
        "minLength": 6
    }
    props["role"] = {
        "title": "Role",
        "description": "The role of the user",
        "type": "string",
        "enum": ["Admin", "Basic User"]
    }
    return schema
