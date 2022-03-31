"""
    Contains the credentials class used to exchange credentials for the login
"""

from helper.serializer import Serializer


class Credentials(Serializer):
    """
        This class represents the credential object used for the login
    """
    def __init__(self):
        self.password = None
        self.username = None

    def deserialize(self, doc):
        """
            This function is used to transform a credential json object to an actual python object
            It is used to decode the json body of requests
        """
        self.username = doc["username"]
        self.password = doc.get("password")

    @staticmethod
    def json_schema():
        """
            returns the json schema of a credential object
        """
        schema = {
            "type": "object",
            "required": ["username", "password"]
        }

        props = schema["properties"] = {}
        props["username"] = {
            "type": "string"
        }
        props["password"] = {
            "type": "string"
        }
        return schema
