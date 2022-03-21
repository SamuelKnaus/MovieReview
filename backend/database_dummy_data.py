"""
This module is used to set up a dummy database
It uses the definitions of the api module and adds dummy data to the database
"""

import datetime
import api
from database.models import Category, Movie, Review, User, UserType

DB = api.DB

# set up the environment
DB.create_all()
DB.session.rollback()

# create the dummy user
USER_1 = User(
    username="dummyGuy",
    email_address="red.unicorn@gmail.com",
    password="thisisnotapassword",
    role=UserType.BASIC_USER
)

USER_2 = User(
    username="dummyAdmin",
    email_address="omnipotent.pencil@yahoo.com",
    password="1234",
    role=UserType.ADMIN
)

USER_3 = User(
    username="grantorinohurricane",
    email_address="grantorinohurricane@gmail.com",
    password="Grantorino1234",
    role=UserType.BASIC_USER
)

USER_4 = User(
    username="lightningbasketball",
    email_address="lightningbasketbal@gmail.com",
    password="Basketball1234",
    role=UserType.BASIC_USER
)

USER_5 = User(
    username="johnkennedy",
    email_address="kennedyj@moviereview.com",
    password="$KenJon9908",
    role=UserType.ADMIN
)

DB.session.add(USER_1)
DB.session.add(USER_2)
DB.session.add(USER_3)
DB.session.add(USER_4)
DB.session.add(USER_5)
DB.session.commit()

# create the categories
CATEGORY_1 = Category(
    title="Thriller"
)

CATEGORY_2 = Category(
    title="War"
)

CATEGORY_3 = Category(
    title="Adventure"
)

CATEGORY_4 = Category(
    title="Animation"
)

CATEGORY_5 = Category(
    title="Action"
)

DB.session.add(CATEGORY_1)
DB.session.add(CATEGORY_2)
DB.session.add(CATEGORY_3)
DB.session.add(CATEGORY_4)
DB.session.add(CATEGORY_5)
DB.session.commit()

# create the movies
MOVIE_1 = Movie(
    title="Léon: The professional",
    director="Luc Besson",
    length=110,
    release_date=datetime.datetime(1999, 9, 14),
    category_id=CATEGORY_1.id
)

MOVIE_2 = Movie(
    title="Apocalypse Now",
    director="Francis Coppola",
    length=123,
    release_date=datetime.datetime(1997, 8, 15),
    category_id=CATEGORY_2.id
)

MOVIE_3 = Movie(
    title="Spider-Man: No Way Home",
    director="Jon Watts",
    length=148,
    release_date=datetime.datetime(2021, 12, 13),
    category_id=CATEGORY_3.id
)

MOVIE_4 = Movie(
    title="Frozen",
    director="Chris Buck",
    length=102,
    release_date=datetime.datetime(2013, 11, 19),
    category_id=CATEGORY_4.id
)

MOVIE_5 = Movie(
    title="Red Notice",
    director="Rawson Marshall Thurber",
    length=118,
    release_date=datetime.datetime(2021, 11, 5),
    category_id=CATEGORY_5.id
)

DB.session.add(MOVIE_1)
DB.session.add(MOVIE_2)
DB.session.add(MOVIE_3)
DB.session.add(MOVIE_4)
DB.session.add(MOVIE_5)
DB.session.commit()

# create the reviews
REVIEW_1 = Review(
    rating=4,
    comment="The film is almost perfect but I don’t like Natalie Portman",
    date=datetime.datetime(2016, 9, 10),
    author_id=USER_1.id,
    movie_id=MOVIE_1.id
)

REVIEW_2 = Review(
    rating=5,
    comment="Such a masterpiece! I love helicopters",
    date=datetime.datetime(2018, 5, 23),
    author_id=USER_1.id,
    movie_id=MOVIE_2.id
)

REVIEW_3 = Review(
    rating=5,
    comment="Amazing movie! This movie was amazing! Both me and my kids loved it! "
            "There is a little more brutal action than the other movies so be prepared for that.",
    date=datetime.datetime(2021, 12, 20),
    author_id=USER_3.id,
    movie_id=MOVIE_3.id
)

REVIEW_4 = Review(
    rating=4,
    comment="Will melt the iciest of hearts, the best animated film of 2013 by "
            "a mile and one of Disney's best in recent years.",
    date=datetime.datetime(2014, 3, 15),
    author_id=USER_3.id,
    movie_id=MOVIE_4.id
)

REVIEW_5 = Review(
    rating=5,
    comment="My girls totally love it! Been watching with them every weekend now "
            "(seems boring now), yet my kids every time feel rejuvenated after watching it.",
    date=datetime.datetime(2015, 5, 31),
    author_id=USER_4.id,
    movie_id=MOVIE_4.id
)

REVIEW_6 = Review(
    rating=2,
    comment="Not as good as I was anticipating. A few good jokes and fight scenes, "
            "but the script was bland and the visuals looked fake. An all-star cast "
            "but no substance to the story or characters.",
    date=datetime.datetime(2021, 12, 1),
    author_id=USER_5.id,
    movie_id=MOVIE_5.id
)

DB.session.add(REVIEW_1)
DB.session.add(REVIEW_2)
DB.session.add(REVIEW_3)
DB.session.add(REVIEW_4)
DB.session.add(REVIEW_5)
DB.session.add(REVIEW_6)

DB.session.commit()
