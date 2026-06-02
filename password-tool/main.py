# main.py

from password_tool.core.password_checker import check_password_strength
from password_tool.core.password_generator import generate_password
from password_tool.core.password_manager import PasswordManager

def main():
    password_manager = PasswordManager()

    while True:
        print("\n--- Password Strength Checker and Generator ---")
        print("1. Check Password Strength")
        print("2. Generate Password")
        print("3. Save Password")
        print("4. Retrieve Password")
        print("5. Exit")
        choice = input("Select an option (1-5): ")

        if choice == '1':
            password = input("Enter the password to check: ")
            strength, feedback = check_password_strength(password)
            print(f"\nPassword Strength: {strength}")
            for tip in feedback:
                print(f"- {tip}")
        elif choice == '2':
            try:
                length = int(input("Enter desired password length: "))
            except ValueError:
                print("Invalid input. Please enter a number.")
                continue

            uppercase = input("Include uppercase letters? (y/n): ").lower() == 'y'
            lowercase = input("Include lowercase letters? (y/n): ").lower() == 'y'
            numbers = input("Include numbers? (y/n): ").lower() == 'y'
            special_chars = input("Include special characters? (y/n): ").lower() == 'y'

            password = generate_password(length, uppercase, lowercase, numbers, special_chars)
            print(f"\nGenerated Password: {password}")
        elif choice == '3':
            account = input("Enter account name: ")
            password = input("Enter password to save: ")
            password_manager.add_password(account, password)
            print(f"Password for {account} saved successfully.")
        elif choice == '4':
            account = input("Enter account name: ")
            password = password_manager.get_password(account)
            if password:
                print(f"Password for {account}: {password}")
            else:
                print("Account not found.")
        elif choice == '5':
            print("Exiting program.")
            break
        else:
            print("Invalid selection. Please try again.")

if __name__ == "__main__":
    main()
