"""
    Contains project wide constants
"""
from datetime import timedelta

DATA_TYPE_JSON = "application/json"
JWT_TOKEN_EXPIRATION_TIME = timedelta(hours=1)
# in reality this secret would be injected from a secure environment,
# for the purpose of this project we hardcode it in this constant file
JWT_TOKEN_SIGNING_SECRET = 'F2y2NcLLZ7EG7EBgWLlDPiYdk6wP6LpwxfA2qcioxvD01sfFVnUCASffhmwWdjN8'
