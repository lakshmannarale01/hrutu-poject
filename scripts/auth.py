def authenticate_librarian(username, password):
    # Simple hardcoded librarian for now
    # Later we can move this to CSV or DB
    if username == "admin" and password == "admin123":
        return True
    return False
