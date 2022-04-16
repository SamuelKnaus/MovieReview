"""
    contains the review json schema
"""


def get_review_json_schema():
    """
        returns the json schema of a review object
    """
    schema = {
        "type": "object",
        "required": ["rating", "comment", "date", "author", "movie_id"]
    }

    props = schema["properties"] = {}
    props["rating"] = {
        "title": "Rating",
        "description": "The rating of the movie (from 1 to 5)",
        "type": "integer",
        "minimum": 1,
        "maximum": 5
    }
    props["comment"] = {
        "title": "Comment",
        "description": "A textual comment",
        "type": "string"
    }
    props["date"] = {
        "title": "Date",
        "description": "The date on which the comment was written",
        "type": "string",
        "format": "date-time"
    }
    props["author"] = {
        "title": "Author",
        "description": "The username of the user which created the review",
        "type": "string",
    }
    props["movie_id"] = {
        "title": "Movie ID",
        "description": "The id of the movie this review was created for which acts as foreign key",
        "type": "integer"
    }
    return schema
