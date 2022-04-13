"""
    Contains project wide constants
"""

NAMESPACE = "moviereviewmeta"
NAMESPACE_LINK = "/" + NAMESPACE + "/link-relations/"
DATA_TYPE_HTML = "text/html"
DATA_TYPE_JSON = "application/json"
DATA_TYPE_MASON = "application/vnd.mason+json"
DATETIME_FORMAT = '%Y-%m-%dT%H:%M:%S.%f%zZ'
THIRD_COMPONENT_URL = "http://localhost:5001"
LOGIN_ENDPOINT = "/login"
TOKEN_VALIDATION_ENDPOINT = "/validateToken"
CACHING_TIMEOUT = 3600
