"""
The category mason builder class
"""

from json_schemas.category_json_schema import get_category_json_schema
from mason.generic_mason_builder import GenericMasonBuilder


class CategoryMasonBuilder(GenericMasonBuilder):
    """
    The mason builder which is responsible for all category endpoints
    """
    def add_control_get_categories(self):
        """
            This method adds the mason documentation for the get all categories endpoint
        """
        self._add_control(
            "categories-get",
            title="Get a list of all categories",
            href=self.api.url_for(self.category_collection)
        )

    def add_control_post_category(self):
        """
            This method adds the mason documentation for the post a new category endpoint
        """
        self._add_control_post(
            "categories-post",
            title="Create a new category",
            href=self.api.url_for(self.category_collection),
            schema=get_category_json_schema()
        )

    def add_control_get_category(self, category):
        """
            This method adds the mason documentation for the get a single category endpoint
        """
        self._add_control(
            "self",
            title="Get a single category",
            href=self.api.url_for(
                self.category_item,
                category=category
            )
        )

    def add_control_update_category(self, category):
        """
            This method adds the mason documentation for the update an existing category endpoint
        """
        self._add_control_put(
            "edit",
            title="Update a category",
            href=self.api.url_for(
                self.category_item,
                category=category
            ),
            schema=get_category_json_schema()
        )

    def add_control_delete_category(self, category):
        """
            This method adds the mason documentation for the delete a category endpoint
        """
        self._add_control_delete(
            "delete",
            title="Delete a category",
            href=self.api.url_for(
                self.category_item,
                category=category
            )
        )
