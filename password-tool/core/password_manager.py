# core/password_manager.py

import json
import os
from datetime import datetime
from cryptography.fernet import Fernet

class PasswordManager:
    def __init__(self, key_file='key.key', password_file='passwords.enc', projects_file='projects.json'):
        self.key_file = key_file
        self.password_file = password_file
        self.projects_file = projects_file
        self.key = self.load_key()
        self.fernet = Fernet(self.key)

    def load_key(self):
        if os.path.exists(self.key_file):
            with open(self.key_file, 'rb') as key_file:
                key = key_file.read()
        else:
            key = Fernet.generate_key()
            with open(self.key_file, 'wb') as key_file:
                key_file.write(key)
        return key

    def add_password(self, account, password):
        encrypted = self.fernet.encrypt(password.encode())
        added_on = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        with open(self.password_file, 'ab') as file:
            # Storing in the format: account:encrypted_password:added_on
            file.write(f"{account}:{encrypted.decode()}:{added_on}\n".encode())

    def get_password(self, account):
        if not os.path.exists(self.password_file):
            return None
        with open(self.password_file, 'rb') as file:
            lines = file.readlines()
            for line in lines:
                parts = line.decode().strip().split(':')
                if len(parts) < 3:
                    continue  # Skip malformed lines
                acc, encrypted, _ = parts
                if acc == account:
                    decrypted = self.fernet.decrypt(encrypted.encode()).decode()
                    return decrypted
        return None

    def get_total_passwords(self):
        if not os.path.exists(self.password_file):
            return 0
        with open(self.password_file, 'rb') as file:
            lines = file.readlines()
            return len(lines)

    def get_last_password_added(self):
        if not os.path.exists(self.password_file):
            return "No passwords added yet."
        with open(self.password_file, 'rb') as file:
            lines = file.readlines()
            if not lines:
                return "No passwords added yet."
            last_line = lines[-1].decode().strip()
            parts = last_line.split(':')
            if len(parts) < 3:
                return "No passwords added yet."
            acc, _, added_on = parts
            return f"{acc} on {added_on}"

    def get_security_alerts(self):
        # Placeholder for security alerts logic
        # You can implement real security checks here
        return "No security alerts at this time."

    def get_projects(self):
        if not os.path.exists(self.projects_file):
            return []
        with open(self.projects_file, 'r') as file:
            try:
                projects = json.load(file)
                return projects
            except json.JSONDecodeError:
                return []

    def add_project(self, project_name, description, password_policy):
        new_project = {
            "project_name": project_name,
            "description": description,
            "password_policy": password_policy
        }
        projects = self.get_projects()
        projects.append(new_project)
        with open(self.projects_file, 'w') as file:
            json.dump(projects, file, indent=4)

    def edit_project(self, project_index, project_name=None, description=None, password_policy=None):
        projects = self.get_projects()
        if 0 <= project_index < len(projects):
            if project_name:
                projects[project_index]["project_name"] = project_name
            if description:
                projects[project_index]["description"] = description
            if password_policy:
                projects[project_index]["password_policy"] = password_policy
            with open(self.projects_file, 'w') as file:
                json.dump(projects, file, indent=4)
            return True
        return False

    def delete_project(self, project_index):
        projects = self.get_projects()
        if 0 <= project_index < len(projects):
            del projects[project_index]
            with open(self.projects_file, 'w') as file:
                json.dump(projects, file, indent=4)
            return True
        return False

    # Placeholder methods for tasks, reports, users
    def get_tasks(self):
        # Implement task retrieval logic
        return [
            ["Update Password Policies", "2024-05-15", "In Progress", "Edit | Complete"],
            ["Audit Password Security", "2024-06-01", "Pending", "Edit | Complete"],
            # Add more tasks as needed
        ]

    def get_reports(self):
        # Implement reporting logic
        return [
            ["Security Report Q1", "2024-04-01"],
            ["Usage Statistics March", "2024-04-05"],
            # Add more reports as needed
        ]

    def get_users(self):
        # Implement user retrieval logic
        return [
            ["Jane Smith", "jane.smith@example.com", "Editor", "Active", "Edit | Deactivate"],
            ["John Doe", "john.doe@example.com", "Administrator", "Active", "Edit | Deactivate"],
            # Add more users as needed
        ]
