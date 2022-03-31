from werkzeug.exceptions import NotFound
from werkzeug.routing import BaseConverter
import database


class UserConverter(BaseConverter):
    """
        This class represents the url converter model of a user
    """
    def to_python(self, value):
        """
            This function converts the url parameter user_id to the actual user object
            input:
                value: the id of the user, which is represented by the username
            output:
                The user with the given id
            exceptions:
                NotFound: It is raised if there exists no user with the given id
        """
        db_user = database.models.User.query.filter_by(username=value).first()
        if db_user is None:
            raise NotFound
        return db_user

    def to_url(self, value):
        """
            This function converts the given user object to its url parameter
            input:
                value: the user object
            output:
                The id of the given user as string
        """
        return str(value.username)
