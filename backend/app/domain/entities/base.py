from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class BaseEntity(BaseModel):
    id: Optional[UUID] = None
    created_at: Optional[datetime] = None
