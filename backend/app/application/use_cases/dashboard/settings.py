from sqlalchemy import select
from sqlalchemy.orm import Session
from app.infrastructure.database.models import SettingsModel
from app.application.dto.dashboard_dto import SettingsDTO, SettingsUpdateDTO
from typing import Optional


class GetSettingsUseCase:
    """Use case to get a setting by ID"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def execute(self, setting_id: str) -> Optional[SettingsDTO]:
        stmt = select(SettingsModel).where(SettingsModel.id == setting_id)
        result = self.db.execute(stmt).scalar_one_or_none()
        
        if result:
            return SettingsDTO(id=result.id, value=result.value)
        return None


class UpdateSettingsUseCase:
    """Use case to create or update a setting"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def execute(self, setting_id: str, dto: SettingsUpdateDTO) -> SettingsDTO:
        # Check if exists
        stmt = select(SettingsModel).where(SettingsModel.id == setting_id)
        existing = self.db.execute(stmt).scalar_one_or_none()
        
        if existing:
            existing.value = dto.value
        else:
            new_setting = SettingsModel(id=setting_id, value=dto.value)
            self.db.add(new_setting)
        
        self.db.commit()
        
        # Fetch and return
        stmt = select(SettingsModel).where(SettingsModel.id == setting_id)
        result = self.db.execute(stmt).scalar_one()
        
        return SettingsDTO(id=result.id, value=result.value)