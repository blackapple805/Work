# hibp_checker.py

import requests
import hashlib

def check_pwned_password(password):
    sha1_password = hashlib.sha1(password.encode('utf-8')).hexdigest().upper()
    prefix, suffix = sha1_password[:5], sha1_password[5:]
    response = requests.get(f'https://api.pwnedpasswords.com/range/{prefix}')
    
    if response.status_code != 200:
        raise RuntimeError(f"Error fetching: {response.status_code}")
    
    hashes = (line.split(':') for line in response.text.splitlines())
    for h, count in hashes:
        if h == suffix:
            return True, int(count)
    return False, 0
