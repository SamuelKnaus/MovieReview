
def get_review_json_schema():
        schema = {
            "type": "object",
            "required": ["id", "rating", "comment", "date", "author_id", "movie_id"]
        }

        props = schema["properties"] = {}
        props["id"] = {
            "description": "Review's id",
            "type": "integer"
        }
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
        props["author_id"] = {
            "description": "The id of the user which created the review which acts as foreign key",
            "type": "integer",
        }
        props["movie_id"] = {
            "description": "The id of the movie this review was created for which acts as foreign key",
            "type": "integer"
        }
        return schema
