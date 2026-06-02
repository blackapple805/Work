# core/password_checker.py

import re
from core.hibp_checker import check_pwned_password
import math

def check_password_strength(password):
    score = 0
    feedback = []

    # Length Check
    if len(password) >= 12:
        score += 2
    elif len(password) >= 8:
        score += 1
    else:
        feedback.append("Password should be at least 8 characters long.")

    # Uppercase Letters Check
    if re.search(r'[A-Z]', password):
        score += 1
    else:
        feedback.append("Include at least one uppercase letter.")

    # Lowercase Letters Check
    if re.search(r'[a-z]', password):
        score += 1
    else:
        feedback.append("Include at least one lowercase letter.")

    # Numbers Check
    if re.search(r'[0-9]', password):
        score += 1
    else:
        feedback.append("Include at least one number.")

    # Special Characters Check
    if re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        score += 1
    else:
        feedback.append("Include at least one special character.")

    # Check against HIBP
    try:
        pwned, count = check_pwned_password(password)
        if pwned:
            score = 0
            feedback.append(f"Password has been found in data breaches {count} times.")
    except Exception as e:
        feedback.append(f"Could not check password against HIBP: {e}")

    # Entropy Calculation
    entropy = calculate_entropy(password)
    feedback.append(f"Password Entropy: {entropy:.2f} bits")

    if entropy < 28:
        feedback.append("Entropy is low; password is very weak.")
    elif entropy < 36:
        feedback.append("Entropy is moderate; consider strengthening your password.")
    elif entropy < 60:
        feedback.append("Entropy is good; your password is fairly strong.")
    else:
        feedback.append("Entropy is excellent; your password is very strong.")

    # Strength Determination
    if score >= 6:
        strength = "Very Strong"
    elif score >= 4:
        strength = "Strong"
    elif score >= 2:
        strength = "Weak"
    else:
        strength = "Very Weak"

    return strength, feedback

def calculate_entropy(password):
    pool_size = 0
    if re.search(r'[a-z]', password):
        pool_size += 26
    if re.search(r'[A-Z]', password):
        pool_size += 26
    if re.search(r'[0-9]', password):
        pool_size += 10
    if re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        pool_size += len('!@#$%^&*(),.?":{}|<>')
    entropy = len(password) * math.log2(pool_size) if pool_size else 0
    return entropy
