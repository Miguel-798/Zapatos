import re
import random
from typing import ClassVar, Optional
from pydantic import BaseModel, field_validator


class SKU(BaseModel):
    """Value Object para código SKU de zapatos - formato simple"""
    value: str
    
    # Formato simple: ZAP-XXXXX (ZAP- seguido de 5 caracteres alfanuméricos)
    SKU_PATTERN: ClassVar = re.compile(r'^ZAP-[A-Z0-9]{5}$')
    
    @field_validator('value')
    @classmethod
    def validate_sku(cls, v: str) -> str:
        if not cls.SKU_PATTERN.match(v.upper()):
            raise ValueError(
                'SKU debe tener formato: ZAP-XXXXX (ej: ZAP-ABC12)'
            )
        return v.upper()
    
    @staticmethod
    def generate() -> str:
        """Genera un SKU automático"""
        chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'  # Sin I, O, 0, 1 para evitar confusiones
        random_part = ''.join(random.choices(chars, k=5))
        return f"ZAP-{random_part}"
    
    def __str__(self) -> str:
        return self.value
    
    def __eq__(self, other: object) -> bool:
        if isinstance(other, SKU):
            return self.value == other.value
        return False
