from copy import deepcopy
from datetime import timezone
from typing import Any, Dict, Optional
from pymongo import MongoClient
import config

MONGO_URI = config.MONGO_URI
client = MongoClient(MONGO_URI)

def GetDb():
    return client["database"]

def MakeDatetimeAware(doc: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    if not doc:
        return doc
    
    doc_copy = deepcopy(doc)
    
    for key in ["created_at", "scheduled_date", "expires_at"]:
        if doc_copy.get(key) and doc_copy[key].tzinfo is None:
            doc_copy[key] = doc_copy[key].replace(tzinfo=timezone.utc)
    
    return doc_copy