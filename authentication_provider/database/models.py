"""
    Contains the database definition
"""

import enum

import api
from helper.serializer import Serializer


class UserType(str, enum.Enum):
    """
    This enum represents the possible roles for a user
    It is used to authorize the use of endpoints
    """
    ADMIN = "Admin"
    BASIC_USER = "Basic User"


class User(api.DB.Model, Serializer):
    """
        This class represents the database model of a user
    """
    username = api.DB.Column(api.DB.String, primary_key=True, nullable=False, unique=True)
    email_address = api.DB.Column(api.DB.String, nullable=False, unique=True)
    password = api.DB.Column(api.DB.String, nullable=False)
    role = api.DB.Column(api.DB.Enum(UserType), nullable=False)

    def serialize(self):
        """
            This function is used to transform a user python object to its json representation
            It is used to encode the json body of requests responses
        """
        return {
            "username": self.username,
            "email_address": self.email_address,
            "role": self.role
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

    @staticmethod
    def json_schema():
        """
            returns the json schema of a user object
        """
        schema = {
            "type": "object",
            "required": ["username", "email_address", "password", "role"]
        }

        props = schema["properties"] = {}
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
            "type": "string",
            "minLength": 6
        }
        props["role"] = {
            "description": "The role of the user",
            "type": "string",
            "enum": ["Admin", "Basic User"]
        }
        return schema

