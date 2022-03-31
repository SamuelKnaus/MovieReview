"""
    Contains the authentication token class used to exchange the authentication token
"""

from helper.serializer import Serializer


class AuthenticationToken(Serializer):
    """
        This class represents the authentication token object used for authentication
    """
    def __init__(self, token=None):
        self.token = token

    def serialize(self):
        """
            This function is used to transform a authentication token python object
            to its json representation
            It is used to encode the json body of requests responses
        """
        return {
            "token": self.token,
        }

    def deserialize(self, doc):
        """
            This function is used to transform an authentication token json object
            to an actual python object
            It is used to decode the json body of requests
        """
        self.token = doc["token"]

    @staticmethod
    def json_schema():
        """
            returns the json schema of an authentication token object
        """
        schema = {
            "type": "object",
            "required": ["token"]
        }

        props = schema["properties"] = {}
        props["token"] = {
            "type": "string"
        }
        return schema
