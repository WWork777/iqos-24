import secrets


secret_key_urlsafe = secrets.token_urlsafe(32)
print("\nSecret Key (URL-safe, decoded length is ~32 bytes):", secret_key_urlsafe)
print("Length:", len(secret_key_urlsafe))