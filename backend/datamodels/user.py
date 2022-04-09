"""
    Contains the User class
"""

import enum

from helper.serializer import Serializer


class UserType(str, enum.Enum):
    """
    This enum represents the possible roles for a user
    It is used to authorize the use of endpoints
    """
    ADMIN = "Admin"
    BASIC_USER = "Basic User"


class User(Serializer):
    """
        This class represents the model of a user
    """
    def __init__(self, username=None, email_address=None, password=None, role=None):
        self.username = username
        self.password = password
        self.role = role
        self.email_address = email_address

    def serialize(self):
        """
            This function is used to transform a user python object to its json representation
            It is used to encode the json body of request responses
        """
        return {
            "username": self.username,
            "email_address": self.email_address,
            "role": self.role,
        }

    def deserialize(self, doc):
        """
            This function is used to transform a user json object to an actual python object
            It is used to decode the json body of requests
        """
        self.username = doc["username"]
        self.email_address = doc.get("email_address")
        self.password = doc.get("password")
        self.role = doc.get("role")
