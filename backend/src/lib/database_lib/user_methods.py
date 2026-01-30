from datetime import datetime, timezone
from typing import Dict, Optional
from .database_config import GetDb

# Both the email and the username must be unique at this point in time.
# This might change in the future.
def DoesUserExist(email: str | None = None, username: str | None = None) -> bool:
    users = GetDb()["users"]

    return (email and users.find_one({"email": email}) is not None) or (username and users.find_one({"username": username}) is not None)

def CreateUser(email: str, username: str, hashed_password: str) -> str:
    if DoesUserExist(email, username):
        raise ValueError("User already exists") 

    users = GetDb()["users"]
    result = users.insert_one({
        "email": email,
        "username": username,
        "password": hashed_password
    })
    
    return str(result.inserted_id)  

def GetAllUserDetails(email: str):
    users = GetDb()["users"]

    return users.find_one({"email": email})

def GetUserIdByEmail(email: str) -> str | None:
    users = GetDb()["users"]
    user = users.find_one({"email": email}, {"_id": 1})

    if user:
        return str(user["_id"])
    
    return None

def GetUsernameByEmail(email: str) -> str | None: 
    users = GetDb()["users"]
    user = users.find_one({"email": email})

    if user:
        return user["username"]
    
    return None

def GetUserEmailByEmailOrUsername(email_or_username: str) -> str | None: 
    users = GetDb()["users"]
    user = users.find_one({"email": email_or_username})

    if user:
        return user["email"]
    
    user = users.find_one({"username": email_or_username})

    if user:
        return user["email"]
    
    return None

def GetUserHashedPasswordInDB(email: str) -> str:
    user = GetDb()["users"].find_one({"email": email}, {"password": 1})

    if not user:
        raise ValueError("User not found")  
    
    return user["password"]

def StoreRefreshToken(user_id: str, token_hash: str, expires_at: datetime, email: str, username: str, device_fingerprint: Optional[str] = None, parent_token_id: Optional[str] = None) -> str:
    refresh_tokens = GetDb()["refresh_tokens"]

    result = refresh_tokens.insert_one({
        "user_id": user_id,
        "email": email,
        "username": username,
        "token_hash": token_hash,
        "expires_at": expires_at,
        "created_at": datetime.now(timezone.utc),
        "device_fingerprint": device_fingerprint,
        "parent_token_id": parent_token_id
    })

    return str(result.inserted_id)

def GetRefreshTokenInfo(token_hash: str) -> Optional[Dict]:
    refresh_tokens = GetDb()["refresh_tokens"]
    token = refresh_tokens.find_one({
        "token_hash": token_hash,
        "expires_at": {"$gt": datetime.now(timezone.utc)}
    })

    if token:
        return {
            "user_id": token["user_id"],
            "email": token["email"],
            "username": token["username"],
            "device_fingerprint": token.get("device_fingerprint"),
            "token_id": str(token["_id"])
        }
    
    return None

def ValidateRefreshToken(user_id: str, token_hash: str) -> bool:
    refresh_tokens = GetDb()["refresh_tokens"]
    token = refresh_tokens.find_one({
        "user_id": user_id,
        "token_hash": token_hash,
        "expires_at": {"$gt": datetime.now(timezone.utc)}
    })

    return token is not None

def RevokeRefreshToken(token_hash: str) -> bool:
    refresh_tokens = GetDb()["refresh_tokens"]
    result = refresh_tokens.delete_one(
        {"token_hash": token_hash},
    )

    return result.deleted_count > 0

def RevokeAllUserRefreshTokens(user_id: str) -> int:
    refresh_tokens = GetDb()["refresh_tokens"]
    result = refresh_tokens.delete_many(
        {"user_id": user_id},
    )

    return result.deleted_count