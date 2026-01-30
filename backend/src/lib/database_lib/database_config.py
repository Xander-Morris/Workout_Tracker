from datetime import timezone
from typing import Dict, Optional
from pymongo import MongoClient
import config

MONGO_URI = config.MONGO_URI
client = MongoClient(MONGO_URI)

def GetDb():
    return client["database"]

def MakeDatetimeAware(doc: Optional[Dict]) -> Optional[Dict]:
    if not doc:
        return doc
    
    if doc.get("created_at") and doc["created_at"].tzinfo is None:
        doc["created_at"] = doc["created_at"].replace(tzinfo=timezone.utc)
    if doc.get("scheduled_date") and doc["scheduled_date"].tzinfo is None:
        doc["scheduled_date"] = doc["scheduled_date"].replace(tzinfo=timezone.utc)
    
    return doc