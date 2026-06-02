# policies.py

class PasswordPolicy:
    def __init__(self, min_length=8, uppercase=1, lowercase=1, numbers=1, special_chars=1):
        self.min_length = min_length
        self.uppercase = uppercase
        self.lowercase = lowercase
        self.numbers = numbers
        self.special_chars = special_chars
