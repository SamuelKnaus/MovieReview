"""
    The user mason builder class
"""

import api
from json_schemas.user_json_schema import get_user_json_schema
from mason.generic_mason_builder import GenericMasonBuilder


class UserMasonBuilder(GenericMasonBuilder):
    """
        The mason builder which is responsible for all review endpoints
    """

    def __init__(self):
        super().__init__()
        self.api = api.API
        self.user_item = api.UserItem
        self.user_collection = api.UserCollection

    def add_control_get_users(self, rel="users-all"):
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
            "add-user",
            title="Create a new user",
            href=self.api.url_for(self.user_collection),
            schema=get_user_json_schema()
        )

    def add_control_get_user(self, user):
        """
            This method adds the mason documentation for the get a single user endpoint
        """
        self._add_control(
            "self",
            title="Get a single user",
            href=self.api.url_for(
                self.user_item,
                user=user
            )
        )

    def add_control_update_user(self, user):
        """
            This method adds the mason documentation for the update an existing user endpoint
        """
        self._add_control_put(
            "edit",
            title="Update a user",
            href=self.api.url_for(
                self.user_item,
                user=user
            ),
            schema=get_user_json_schema()
        )

    def add_control_delete_user(self, user):
        """
            This method adds the mason documentation for the delete a user endpoint
        """
        self._add_control_delete(
            "delete",
            title="Delete a user",
            href=self.api.url_for(
                self.user_item,
                user=user
            )
        )
