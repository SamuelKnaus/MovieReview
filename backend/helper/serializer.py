from sqlalchemy import inspect


class Serializer:
    def serialize(self):
        return {c: getattr(self, c) for c in inspect(self).attrs.keys()}

    def serialize_list(l):
        return [m.serialize() for m in l]
