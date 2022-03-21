"""
    The review mason builder class
"""
import api
from json_schemas.review_json_schema import get_review_json_schema
from mason.generic_mason_builder import GenericMasonBuilder


class ReviewMasonBuilder(GenericMasonBuilder):
    """
        The mason builder which is responsible for all review endpoints
    """

    def __init__(self):
        self.api = api.API
        self.review_item = api.MovieReviewItem
        self.movie_review_collection = api.MovieReviewCollection
        self.user_review_collection = api.UserReviewCollection

    def add_control_get_reviews_of_user(self, user):
        """
            This method adds the mason documentation for the get all reviews of a user endpoint
        """
        self._add_control(
            "reviews-get-of-user",
            title="Get a list of all reviews of this user",
            href=self.api.url_for(
                self.user_review_collection,
                user=user
            )
        )

    def add_control_get_reviews_for_movie(self, movie):
        """
            This method adds the mason documentation for the get all reviews for a movie endpoint
        """
        self._add_control(
            "reviews-get-for-movie",
            title="Get a list of all reviews for this movie",
            href=self.api.url_for(
                self.movie_review_collection,
                movie=movie
            )
        )

    def add_control_post_review(self):
        """
            This method adds the mason documentation for the post a new review endpoint
        """
        self._add_control_post(
            "reviews-post",
            title="Create a new review",
            href=self.api.url_for(self.movie_review_collection),
            schema=get_review_json_schema()
        )

    def add_control_get_review(self, review):
        """
            This method adds the mason documentation for the get a single review of a movie endpoint
        """
        self._add_control(
            "self",
            title="Get a single review",
            href=self.api.url_for(
                self.review_item,
                review=review
            )
        )

    def add_control_update_review(self, review):
        """
            This method adds the mason documentation for the update an existing review endpoint
        """
        self._add_control_put(
            "edit",
            title="Update a review",
            href=self.api.url_for(
                self.review_item,
                review=review
            ),
            schema=get_review_json_schema()
        )

    def add_control_delete_review(self, review):
        """
            This method adds the mason documentation for the delete a review endpoint
        """
        self._add_control_delete(
            "delete",
            title="Delete a review",
            href=self.api.url_for(
                self.review_item,
                review=review
            )
        )