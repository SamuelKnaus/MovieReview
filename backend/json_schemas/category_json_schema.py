"""
    contains the category json schema
"""


def get_category_json_schema():
    """
        returns the json schema of a category object
    """
    schema = {
        "type": "object",
        "required": ["title"]
    }

    props = schema["properties"] = {}
    props["title"] = {
        "title": "Title",
        "description": "The name of the category",
        "type": "string"
    }
    return schema
