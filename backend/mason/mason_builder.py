"""
    The mason builder class
"""

import api

from mason.user_mason_builder import UserMasonBuilder
from mason.movie_mason_builder import MovieMasonBuilder
from mason.category_mason_builder import CategoryMasonBuilder
from mason.review_mason_builder import ReviewMasonBuilder


class MasonBuilder(dict, UserMasonBuilder, ReviewMasonBuilder,
                   MovieMasonBuilder, CategoryMasonBuilder):
    """
        A single mason builder class which combines all the single mason builders
    """
    def __init__(self, *args, **kwargs):
        dict.__init__(self, *args, **kwargs)
        self.api = api.API

        self.user_item = api.UserItem
        self.user_collection = api.UserCollection

        self.review_item = api.MovieReviewItem
        self.movie_review_collection = api.MovieReviewCollection
        self.user_review_collection = api.UserReviewCollection

        self.movie_item = api.MovieItem
        self.movie_collection = api.MovieCollection

        self.category_item = api.CategoryItem
        self.category_collection = api.CategoryCollection
