"""
    All the endpoints for the review resources
"""
import werkzeug
from flask import request
from flask_restful import Resource

import api
from database.models import Review, Movie
from helper.error_response import ErrorResponse
from helper.request_blueprints import get_blueprint, put_blueprint, delete_blueprint, post_blueprint
from json_schemas.review_json_schema import get_review_json_schema
from mason.mason_builder import MasonBuilder


class UserReviewCollection(Resource):
    """
        This class represents the user review collection endpoints
        ALl endpoints in this class are out of the perspective of a user,
        so the reviews belong to/are written by one specific user
        It contains the definition of a get endpoint only
        To add new reviews you have to use the MovieReviewCollection endpoints
    """
    @classmethod
    def get(cls, user):
        """
            This method represents the get endpoint of this resource
            input:
                user: the user, who wrote the reviews
            output:
                the http response object containing either the list of reviews written by this
                user or a http error with the corresponding error message
        """
        reviews = Review.query.filter_by(author_id=user.id).all()
        items = []
        for review in reviews:
            movie = Movie.query.filter_by(id=review.movie_id).first()

            item = MasonBuilder(review.serialize())
            item.add_control_get_review(movie, review, "item")
            items.append(item)

        body = MasonBuilder()
        body.add_control_get_user(user, "up")
        body.add_control_get_reviews_of_user(user=user, rel="self")
        body["items"] = items
        return get_blueprint(body)


class MovieReviewCollection(Resource):
    """
        This class represents the movie review collection endpoints
        ALl endpoints in this class are out of the perspective of a movie,
        so the reviews belong to/are written for one specific movie
        It contains the definition of a get and a post endpoint
    """
    @classmethod
    def get(cls, movie):
        """
            This method represents the get endpoint of this resource
            input:
                movie: the movie which the reviews have been requested for
            output:
                the http response object containing either the list of reviews of this movie
                or a http error with the corresponding error message
        """
        reviews = Review.query.filter_by(movie_id=movie.id).all()
        review_items = []
        for review in reviews:
            item = MasonBuilder(review.serialize())
            item.add_control_get_review(movie, review, "item")
            review_items.append(item)

        body = MasonBuilder()
        body.add_api_namespace()
        body.add_control_get_movie(movie, "up")
        body.add_control_get_reviews_for_movie(movie=movie, rel="self")
        body.add_control_post_review(movie=movie)
        body["items"] = review_items
        return get_blueprint(body)

    @classmethod
    def __create_review_object(cls, movie, created_review):
        created_review.deserialize(request.json)

        if created_review.movie_id != movie.id:
            raise werkzeug.exceptions.BadRequest(
                "The movie_id does not match the given url parameter"
            )
        return created_review

    @classmethod
    def __get_url_for_created_item(cls, movie, review):
        return api.API.url_for(MovieReviewItem, movie=movie, review=review)

    def post(self, movie):
        """
            This method represents the post endpoint of this resource,
            which is used to add a new review for the given movie to the database
            It uses the blueprint function of the helper module
            input:
                movie: the movie which this review is associated to
            output:
                a http response object representing the result of this operation
        """
        review = Review()
        return post_blueprint(
            request,
            get_review_json_schema,
            api.DB,
            lambda: self.__create_review_object(movie, review),
            lambda: self.__get_url_for_created_item(movie, review)
        )


class MovieReviewItem(Resource):
    """
        This class represents the movie review item endpoints
        It contains the definition of a get, a put and a delete endpoint
    """
    @classmethod
    def get(cls, movie, review):
        """
            This method represents the get endpoint of this resource
            input:
                movie: the movie, this review has been written for
                review: the review, the url parameter refers to
            output:
                the http response object containing either the review with the given id
                for the movie with the given id
                or a 404 http error if no movie or no review with the given id exists
        """
        if movie.id != review.movie_id:
            return ErrorResponse.get_not_found()

        body = MasonBuilder(review.serialize())
        body.add_api_namespace()
        body.add_control_get_reviews_for_movie(movie, "collection")
        body.add_control_get_review(movie, review)
        body.add_control_update_review(movie, review)
        body.add_control_delete_review(movie, review)
        return get_blueprint(body)

    @classmethod
    def __update_review_object(cls, review, update_review):
        update_review.deserialize(request.json)

        if review.author_id != update_review.author_id:
            raise werkzeug.exceptions.BadRequest("The author_id cannot be changed")
        if review.movie_id != update_review.movie_id:
            raise werkzeug.exceptions.BadRequest("The movie_id cannot be changed")

        review.rating = update_review.rating
        review.comment = update_review.comment
        review.date = update_review.date
        review.author_id = update_review.author_id
        review.movie_id = update_review.movie_id

    def put(self, movie, review):
        """
            This method represents the put endpoint of this resource,
            which is used to update the review of a movie in the database
            It uses the blueprint function of the helper module
            input:
                movie: the movie, this review was written for
                review: the old review object which is to be updated
            output:
                a http response object representing the result of this operation
        """
        if movie.id != review.movie_id:
            return ErrorResponse.get_not_found()

        update_review = Review()
        return put_blueprint(request, get_review_json_schema, api.DB,
                             lambda: self.__update_review_object(review, update_review))

    @classmethod
    def delete(cls, movie, review):
        """
            This method represents the delete endpoint of this resource,
            which is used to remove a review of a certain movie from the database
            It uses the blueprint function of the helper module
            input:
                movie: the movie, this review was written for
                review: the review object which is to be deleted
            output:
                a http response object representing the result of this operation
        """
        if movie.id != review.movie_id:
            return ErrorResponse.get_not_found()

        return delete_blueprint(api.DB, review)
