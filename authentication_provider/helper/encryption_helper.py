"""
    This module contains the encryption helper which is used to store passwords securely
"""

import bcrypt


class EncryptionHelper:
    """
        Contains the encryption methods as static functions
    """
    @staticmethod
    def encrypt_password(password):
        """
            Encrypts a password including salts
            input:
                password: The password which is to be encrypted as string
            output: The salted and encrypted password as string
        """
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf8'), salt)

    @staticmethod
    def check_password(password, encrypted_password):
        """
            Checks if a given password is equal to its encrypted version
            input:
                password: The password as plaintext string
                encrypted_password: An encrypted string
            output: A boolean indicating if the encrypted_password is the encrypted
                version of the given plaintext
        """
        return bcrypt.checkpw(password.encode('utf8'), encrypted_password)
