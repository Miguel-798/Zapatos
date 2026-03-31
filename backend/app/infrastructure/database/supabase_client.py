from supabase import create_client, Client
from app.config import settings

_supabase_client: Client = None


def get_supabase() -> Client:
    """Get the singleton Supabase client for regular operations."""
    global _supabase_client
    if _supabase_client is None:
        _supabase_client = create_client(
            settings.supabase_url,
            settings.supabase_key
        )
    return _supabase_client


def get_supabase_admin() -> Client:
    """Admin client with service role key for privileged operations."""
    if not settings.supabase_service_key:
        raise ValueError("SUPABASE_SERVICE_KEY not configured")
    return create_client(
        settings.supabase_url,
        settings.supabase_service_key
    )
