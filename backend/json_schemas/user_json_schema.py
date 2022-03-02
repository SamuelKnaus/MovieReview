
def get_user_json_schema():
        schema = {
            "type": "object",
            "required": ["id", "username", "email_address", "password", "role"]
        }

        props = schema["properties"] = {}
        props["id"] = {
            "description": "User's id",
            "type": "integer"
        }
        props["username"] = {
            "description": "The username of the user",
            "type": "string"
        }
        props["email_address"] = {
            "description": "The email address of the user",
            "type": "string",
            "format": "email"
        }
        props["password"] = {
            "description": "The password of the user",
            "type": "string"
        }
        props["role"] = {
            "description": "The role of the user which can either be 'basic user' or admin",
            "type": "string",
            "enum": ["Admin", "Basic User"]
        }
        return schema