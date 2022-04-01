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
        "description": "The rating of the movie (from 1 to 5)",
        "type": "integer",
        "minimum": 1,
        "maximum": 5
    }
    props["comment"] = {
        "description": "A textual comment",
        "type": "string"
    }
    props["date"] = {
        "description": "The date on which the comment was written",
        "type": "string",
        "format": "date-time"
    }
    props["author"] = {
        "description": "The username of the user which created the review",
        "type": "string",
    }
    props["movie_id"] = {
        "description": "The id of the movie this review was created for which acts as foreign key",
        "type": "integer"
    }
    return schema
