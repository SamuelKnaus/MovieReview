import enum
from datetime import date

from flask import Flask, request
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import event
from sqlalchemy.engine import Engine
from werkzeug.exceptions import NotFound
from werkzeug.routing import BaseConverter

from helper.request_blueprints import post_blueprint, put_blueprint, delete_blueprint
from helper.serializer import Serializer
from json_schemas.category_json_schema import get_category_json_schema
from json_schemas.movie_json_schema import get_movie_json_schema
from json_schemas.review_json_schema import get_review_json_schema
from json_schemas.user_json_schema import get_user_json_schema

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///movie-review.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.url_map.strict_slashes = False

api = Api(app)
db = SQLAlchemy(app)


# Enable foreign key constraints for SQLite
@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


# DATABASE MODEL
class UserType(str, enum.Enum):
    admin = "Admin"
    basicUser = "Basic User"


class Movie(db.Model, Serializer):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String, nullable=False)
    director = db.Column(db.String, nullable=False)
    length = db.Column(db.Integer, nullable=False)
    release_date = db.Column(db.Date, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey("category.id", ondelete="RESTRICT"), nullable=False)

    category = db.relationship("Category")
    reviews = db.relationship("Review", cascade="delete", back_populates="movie")

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "director": self.director,
            "length": self.length,
            "release_date": self.release_date.isoformat(),
            "category_id": self.category_id
        }

    def deserialize(self, doc):
        self.title = doc["title"]
        self.director = doc.get("director")
        self.length = doc.get("length")
        self.release_date = date.fromisoformat(doc["release_date"])
        self.category_id = doc.get("category_id")


class Category(db.Model, Serializer):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String, nullable=False)

    movies = db.relationship("Movie", back_populates="category")

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title
        }

    def deserialize(self, doc):
        self.title = doc["title"]


class Review(db.Model, Serializer):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=False)
    date = db.Column(db.Date, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey("user.id", ondelete="SET NULL"), nullable=True)
    movie_id = db.Column(db.Integer, db.ForeignKey("movie.id", ondelete="CASCADE"), nullable=False)

    movie = db.relationship("Movie")
    user = db.relationship("User")

    def deserialize(self, doc):
        self.rating = doc["rating"]
        self.comment = doc.get("comment")
        self.date = date.fromisoformat(doc["date"])
        self.author_id = doc.get("author_id")
        self.movie_id = doc.get("movie_id")

    def serialize(self):
        return {
            "id": self.id,
            "rating": self.rating,
            "comment": self.comment,
            "date": self.date.isoformat(),
            "author_id": self.author_id,
            "movie_id": self.movie_id
        }


class User(db.Model, Serializer):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String, nullable=False, unique=True)
    email_address = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)
    role = db.Column(db.Enum(UserType), nullable=False)

    review = db.relationship("Review", back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email_address": self.email_address,
            "role": self.role
        }

    def deserialize(self, doc):
        self.username = doc["username"]
        self.email_address = doc.get("email_address")
        self.password = doc.get("password")
        self.role = doc.get("role")


# CONVERTERS
class CategoryConverter(BaseConverter):
    def to_python(self, category_id):
        db_category = Category.query.filter_by(id=category_id).first()
        if db_category is None:
            raise NotFound
        return db_category

    def to_url(self, db_category):
        return str(db_category.id)


class MovieConverter(BaseConverter):
    def to_python(self, movie_id):
        db_movie = Movie.query.filter_by(id=movie_id).first()
        if db_movie is None:
            raise NotFound
        return db_movie

    def to_url(self, db_movie):
        return str(db_movie.id)


class ReviewConverter(BaseConverter):
    def to_python(self, review_id):
        db_review = Review.query.filter_by(id=review_id).first()
        if db_review is None:
            raise NotFound
        return db_review

    def to_url(self, db_review):
        return str(db_review.id)


class UserConverter(BaseConverter):
    def to_python(self, user_id):
        db_user = User.query.filter_by(id=user_id).first()
        if db_user is None:
            raise NotFound
        return db_user

    def to_url(self, db_user):
        return str(db_user.id)


# CATEGORY LOGIC
class CategoryCollection(Resource):
    def get(self):
        categories = Category.query.all()
        categories = Category.serialize_list(categories)
        return categories, 200

    def create_category_object(self, created_category):
        created_category.deserialize(request.json),
        return created_category

    def post(self):
        category = Category()
        return post_blueprint(request, get_category_json_schema, db, lambda: self.create_category_object(category))


api.add_resource(CategoryCollection, "/api/categories/")


class CategoryItem(Resource):
    def get(self, category):
        return category.serialize()

    def update_category_object(self, category, update_category):
        update_category.deserialize(request.json)

        category.title = update_category.title

    def put(self, category):
        update_category = Category()
        return put_blueprint(request, get_category_json_schema, db,
                             lambda: self.update_category_object(category, update_category))

    def delete(self, category):
        return delete_blueprint(db, category)


app.url_map.converters["category"] = CategoryConverter
api.add_resource(CategoryItem, "/api/categories/<category:category>/")


# MOVIE LOGIC
class MovieCollection(Resource):
    def get(self):
        movies = Movie.query.all()
        movies = Category.serialize_list(movies)
        return movies, 200

    def create_movie_object(self, created_movie):
        created_movie.deserialize(request.json),
        return created_movie

    def post(self):
        movie = Movie()
        return post_blueprint(request, get_movie_json_schema, db, lambda: self.create_movie_object(movie))


api.add_resource(MovieCollection, "/api/movies/")


class MovieItem(Resource):
    def get(self, movie):
        return movie.serialize()

    def update_movie_object(self, movie, update_movie):
        update_movie.deserialize(request.json)

        movie.title = update_movie.title
        movie.director = update_movie.director
        movie.length = update_movie.length
        movie.release_date = update_movie.release_date
        movie.category_id = update_movie.category_id

    def put(self, movie):
        update_movie = Movie()
        return put_blueprint(request, get_movie_json_schema, db, lambda: self.update_movie_object(movie, update_movie))

    def delete(self, movie):
        return delete_blueprint(db, movie)


app.url_map.converters["movie"] = MovieConverter
api.add_resource(MovieItem, "/api/movies/<movie:movie>/")


# REVIEW LOGIC
class MovieReviewCollection(Resource):
    def get(self, movie):
        movies = Review.query.filter_by(movie_id=movie.id).all()
        movies = Category.serialize_list(movies)
        return movies, 200

    def create_review_object(self, movie, created_review):
        created_review.deserialize(request.json),
        # ignore the foreign key and set it to the parameter given in the url
        created_review.movie_id = movie.id
        return created_review

    def post(self, movie):
        review = Review()
        return post_blueprint(request, get_review_json_schema, db, lambda: self.create_review_object(movie, review))


api.add_resource(MovieReviewCollection, "/api/movies/<movie:movie>/reviews/")


class MovieReviewItem(Resource):
    def get(self, movie, review):
        return review.serialize()

    def update_review_object(self, review, update_review):
        update_review.deserialize(request.json)

        review.rating = update_review.rating
        review.comment = update_review.comment
        review.date = update_review.date
        review.author_id = update_review.author_id
        review.movie_id = update_review.movie_id

    def put(self, movie, review):
        update_review = Review()
        return put_blueprint(request, get_review_json_schema, db,
                             lambda: self.update_review_object(review, update_review))

    def delete(self, movie, review):
        return delete_blueprint(db, review)


app.url_map.converters["review"] = ReviewConverter
api.add_resource(MovieReviewItem, "/api/movies/<movie:movie>/reviews/<review:review>")


# USERS LOGIC
class UserCollection(Resource):
    def get(self):
        users = User.query.all()
        users = User.serialize_list(users)
        return users, 200

    def create_user_object(self, created_user):
        created_user.deserialize(request.json),
        return created_user

    def post(self):
        user = User()
        return post_blueprint(request, get_user_json_schema, db, lambda: self.create_user_object(user))


api.add_resource(UserCollection, "/api/users/")


class UserItem(Resource):
    def get(self, user):
        return user.serialize()

    def update_review_object(self, user, update_user):
        update_user.deserialize(request.json)

        user.username = update_user.username
        user.email_address = update_user.email_address
        user.password = update_user.password
        user.role = update_user.role

    def put(self, user):
        update_user = User()
        return put_blueprint(request, get_user_json_schema, db, lambda: self.update_review_object(user, update_user))

    def delete(self, user):
        return delete_blueprint(db, user)


app.url_map.converters["user"] = UserConverter
api.add_resource(UserItem, "/api/users/<user:user>/")


class UserReviewCollection(Resource):
    def get(self, user):
        reviews = Review.query.filter_by(author_id=user.id).all()
        reviews = Review.serialize_list(reviews)
        return reviews, 200


api.add_resource(UserReviewCollection, "/api/users/<user:user>/reviews/")
