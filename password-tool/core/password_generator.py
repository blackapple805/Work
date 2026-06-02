# password_generator.py

import random
import string

def generate_password(length=12, uppercase=True, lowercase=True, numbers=True, special_chars=True):
    character_pool = ''

    if uppercase:
        character_pool += string.ascii_uppercase
    if lowercase:
        character_pool += string.ascii_lowercase
    if numbers:
        character_pool += string.digits
    if special_chars:
        character_pool += string.punctuation

    if not character_pool:
        return "Error: No character types selected."

    password = ''.join(random.choice(character_pool) for _ in range(length))
    return password
