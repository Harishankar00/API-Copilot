import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- Helper Functions for your Copilot ---

def upload_requirement_file(file_path: str, file_name: str):
    """Uploads the raw file to Supabase Storage"""
    with open(file_path, 'rb') as f:
        response = supabase.storage.from_("requirements-files").upload(file_name, f)
    return response

def save_generated_specs(user_id: str, filename: str, specs_json: dict):
    """Stores the AI-generated JSON into the Postgres database"""
    data = {
        "user_id": user_id,
        "raw_filename": filename,
        "content_json": specs_json
    }
    response = supabase.table("specifications").insert(data).execute()
    return response

print("✅ Supabase client & Helpers initialized!")