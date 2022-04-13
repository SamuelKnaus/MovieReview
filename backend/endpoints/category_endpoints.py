"""
    All the endpoints for the category resource
"""

from flask import request
from flask_restful import Resource

import api
from constants import CACHING_TIMEOUT
from database.models import Category
from helper.request_blueprints import get_blueprint, put_blueprint, delete_blueprint, post_blueprint
from json_schemas.category_json_schema import get_category_json_schema
from mason.mason_builder import MasonBuilder


class CategoryCollection(Resource):
    """
        This class represents the category collection endpoints
        It contains the definition of a get and a post endpoint
    """
    @classmethod
    @api.CACHE.memoize(timeout=CACHING_TIMEOUT)
    def get(cls):
        """
            This method represents the get endpoint of this resource
            output:
                the http response object containing either the list of categories
                or a http error with the corresponding error message
        """
        categories = Category.query.all()
        category_items = []
        for category in categories:
            item = MasonBuilder(category.serialize())
            item.add_control_get_category(category)
            category_items.append(item)

        body = MasonBuilder()
        body.add_api_namespace()
        body.add_control_view_function()
        body.add_control_get_categories("self")
        body.add_control_post_category()
        body["items"] = category_items
        return get_blueprint(body)

    @classmethod
    def __create_category_object(cls, created_category):
        created_category.deserialize(request.json)
        return created_category

    @classmethod
    def __get_url_for_created_item(cls, category):
        return api.API.url_for(CategoryItem, category=category)

    def post(self):
        """
            This method represents the post endpoint of this resource,
            which is used to add a new category to the database
            It uses the blueprint function of the helper module
            output:
                a http response object representing the result of this operation
        """
        self.clear_cache()

        category = Category()
        return post_blueprint(
            request,
            get_category_json_schema,
            api.DB,
            lambda: self.__create_category_object(category),
            lambda: self.__get_url_for_created_item(category)
        )

    @staticmethod
    def clear_cache():
        """
            Invalidates the cache for the get endpoint of this resource
        """
        api.CACHE.delete_memoized(CategoryCollection.get)


class CategoryItem(Resource):
    """
        This class represents the category item endpoints
        It contains the definition of a get, a put and a delete endpoint
    """
    @classmethod
    @api.CACHE.memoize(timeout=CACHING_TIMEOUT)
    def get(cls, category):
        """
            This method represents the get endpoint of this resource
            input:
                category: the category entry the URL parameter refers to
            output:
                the http response object containing either the category with the given id
                or a 404 http error if no movie with this id exists
        """
        body = MasonBuilder(category.serialize())
        body.add_api_namespace()
        body.add_control_get_categories("collection")
        body.add_control_get_category(category)
        body.add_control_update_category(category)
        body.add_control_delete_category(category)
        return get_blueprint(body)

    @classmethod
    def __update_category_object(cls, category, update_category):
        update_category.deserialize(request.json)

        category.title = update_category.title

    def put(self, category):
        """
            This method represents the put endpoint of this resource,
            which is used to update a category in the database
            It uses the blueprint function of the helper module
            input:
                category: the old category object which is to be updated
            output:
                a http response object representing the result of this operation
        """
        self.clear_cache(category)
        CategoryCollection.clear_cache()

        update_category = Category()
        return put_blueprint(request, get_category_json_schema, api.DB,
                             lambda: self.__update_category_object(category, update_category))

    @classmethod
    def delete(cls, category):
        """
            This method represents the delete endpoint of this resource,
            which is used to remove a category from the database
            It uses the blueprint function of the helper module
            input:
                category: the category object which is to be deleted
            output:
                a http response object representing the result of this operation
        """
        cls.clear_cache(category)
        CategoryCollection.clear_cache()

        return delete_blueprint(api.DB, category)

    @staticmethod
    def clear_cache(category):
        """
            Invalidates the cache for the get endpoint of this resource
        """
        api.CACHE.delete_memoized(CategoryItem.get, CategoryItem, category)
