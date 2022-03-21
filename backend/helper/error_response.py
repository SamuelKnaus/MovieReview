import json

from flask import Response


DATA_TYPE_JSON = "application/json"


class ErrorResponse:
    """
    This helper class is used to enable similar behaviour for all http error responses
    """
    def __init__(self, message, status_code):
        """
        The constructor requires the developer to specify the http error
        input:
            message: A small string explaining the reason for the error
            status_code: The http status code of the response
        """
        self.message = message
        self.status_code = status_code

    def get_http_response(self):
        """
            This function transforms the object to a http response object
            using the information set in the constructor
        """
        json_string = {
            "message": self.message,
        }
        return Response(json.dumps(json_string), status=self.status_code, mimetype=DATA_TYPE_JSON)

    @staticmethod
    def get_unsupported_media_type():
        return ErrorResponse("Unsupported media type", 415).get_http_response()
