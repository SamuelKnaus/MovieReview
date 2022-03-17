"""
This module can be used to set up a new database
"""

import api

DB = api.DB

DB.create_all()
