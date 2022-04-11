"""
    The user mason builder class
"""

import api
from json_schemas.user_json_schema import get_user_json_schema
from json_schemas.credentials_json_schema import get_credentials_json_schema
from mason.generic_mason_builder import GenericMasonBuilder
from constants import NAMESPACE, THIRD_COMPONENT_URL, LOGIN_ENDPOINT


class UserMasonBuilder(GenericMasonBuilder):
    """
        The mason builder which is responsible for all review endpoints
    """

    def __init__(self):
        super().__init__()
        self.api = api.API
        self.user_item = api.UserItem
        self.user_collection = api.UserCollection
        self.authenticated_user_item = api.AuthenticatedUserItem

    def add_control_get_users(self, rel=NAMESPACE+":users-all"):
        """
            This method adds the mason documentation for the get all users endpoint
        """
        self._add_control(
            rel,
            title="Get a list of all users",
            href=self.api.url_for(self.user_collection)
        )

    def add_control_post_user(self):
        """
            This method adds the mason documentation for the post a new user endpoint
        """
        self._add_control_post(
            NAMESPACE + ":add-user",
            title="Create a new user",
            href=self.api.url_for(self.user_collection),
            schema=get_user_json_schema()
        )

    def add_control_get_user(self, username, rel="self"):
        """
            This method adds the mason documentation for the get a single user endpoint
        """
        self._add_control(
            rel,
            title="Get a single user",
            href=self.api.url_for(
                self.user_item,
                _username=username
            )
        )

    def add_control_update_user(self, username):
        """
            This method adds the mason documentation for the update an existing user endpoint
        """
        self._add_control_put(
            "edit",
            title="Update a user",
            href=self.api.url_for(
                self.user_item,
                _username=username
            ),
            schema=get_user_json_schema()
        )

    def add_control_delete_user(self, username):
        """
            This method adds the mason documentation for the delete a user endpoint
        """
        self._add_control_delete(
            NAMESPACE + ":delete",
            title="Delete a user",
            href=self.api.url_for(
                self.user_item,
                _username=username
            )
        )

    def add_control_get_authenticated_user(self):
        """
            This method adds the mason documentation for the get the authenticated user endpoint
        """
        self._add_control(
            NAMESPACE + ":current-user",
            title="Get the currently authenticated user",
            href=self.api.url_for(
                self.authenticated_user_item
            )
        )

    def add_control_login(self):
        """
            This method adds the mason documentation for the login post endpoint
            of the third component
        """
        self._add_control_post(
            NAMESPACE + ":login",
            title="Get the currently authenticated user",
            href=THIRD_COMPONENT_URL + LOGIN_ENDPOINT,
            schema=get_credentials_json_schema()
        )
