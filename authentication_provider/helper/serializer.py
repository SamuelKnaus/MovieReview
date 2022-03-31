"""
    contains the generic serializer class
"""
from sqlalchemy import inspect


class Serializer:
    """
        A generic helper class which serializable objects can inherit from
    """
    def serialize(self):
        """
            transforms a python object to its json representation to make it serializable
            result:
                the json string
        """
        return {c: getattr(self, c) for c in inspect(self).attrs.keys()}

    @classmethod
    def serialize_list(cls, object_list):
        """
            serializes a list of objects by using the serialize method
            result:
                the json string
        """
        return [m.serialize() for m in object_list]
