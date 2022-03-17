def get_category_json_schema():
    schema = {
        "type": "object",
        "required": ["title"]
    }

    props = schema["properties"] = {}
    props["title"] = {
        "description": "The name of the category",
        "type": "string"
    }
    return schema
