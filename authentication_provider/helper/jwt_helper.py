"""
    This module contains the jwt helper which is used to handle jwt tokens
"""
from datetime import datetime, timezone
import jwt
from constants import JWT_TOKEN_EXPIRATION_TIME, JWT_TOKEN_SIGNING_SECRET


class JWTHelper:
    """
        Contains all the jwt token logic, all the helper functions are static
    """
    @staticmethod
    def create_token(username):
        """
            Creates a new jwt token
            input:
                username: the name of the user this token is created for
            output: The created jwt token object
        """
        payload = {
            'iss': username,
            "iat": datetime.now(tz=timezone.utc),
            "exp": datetime.now(tz=timezone.utc) + JWT_TOKEN_EXPIRATION_TIME,
        }
        token = jwt.encode(payload, JWT_TOKEN_SIGNING_SECRET, algorithm="HS256")
        return token

    @staticmethod
    def check_token_validity(token):
        """
            Checks if a given password is equal to its encrypted version
            input:
                password: The password as plaintext string
                encrypted_password: An encrypted string
            output: A boolean indicating if the encrypted_password is the encrypted
                version of the given plaintext
            exceptions:
                jwt.ExpiredSignatureError: If the authentication token is expired
                jwt.InvalidTokenError: The token was invalid
        """
        payload = jwt.decode(token, JWT_TOKEN_SIGNING_SECRET, algorithms=['HS256'])
        return payload
