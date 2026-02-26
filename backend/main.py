import os
import tempfile
import PyPDF2
from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

# Import our custom modules
from database import supabase, upload_requirement_file, save_generated_specs
from ai_pipeline import process_requirements

app = FastAPI(
    title="SpecDraft AI API",
    description="Production backend for Requirement to Spec Copilot",
    version="1.0.0"
)

# --- 1. Security / CORS ---
# In production, replace "*" with your actual React frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. Pydantic Models for Input Validation ---
class AuthRequest(BaseModel):
    email: str
    password: str

# --- 3. Authentication Dependency ---
def get_current_user(authorization: str = Header(None)):
    """Validates the Supabase JWT token sent by the React frontend"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    
    token = authorization.split(" ")[1]
    
    # Verify token with Supabase
    try:
        user_response = supabase.auth.get_user(token)
        if not user_response or not user_response.user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_response.user
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")

# --- 4. Authentication Routes ---
@app.post("/auth/signup")
async def signup(req: AuthRequest):
    try:
        response = supabase.auth.sign_up({"email": req.email, "password": req.password})
        return {"message": "User created successfully!", "data": response}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/auth/login")
async def login(req: AuthRequest):
    try:
        response = supabase.auth.sign_in_with_password({"email": req.email, "password": req.password})
        return {"message": "Login successful", "session": response.session}
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Login failed. Check credentials. {str(e)}")

# --- 5. Core AI Generation Route ---
@app.post("/api/generate")
async def generate_specs(
    file: Optional[UploadFile] = File(None),
    raw_text: Optional[str] = Form(None),
    current_user = Depends(get_current_user)
):
    """
    Accepts EITHER an uploaded file (.txt, .pdf) OR raw text.
    Runs the AI pipeline and saves the result to Supabase.
    """
    if not file and not raw_text:
        raise HTTPException(status_code=400, detail="Must provide either a file or raw text.")

    extracted_text = raw_text or ""
    file_name = "manual_text_input.txt"

    # Handle File Upload
    if file:
        file_name = file.filename
        content = await file.read()
        
        # Extract text based on file type
        if file_name.endswith(".pdf"):
            import io
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
            extracted_text = "".join(page.extract_text() for page in pdf_reader.pages)
        else:
            # Assume plain text for .txt, .csv, etc.
            extracted_text = content.decode("utf-8")

        # Save file locally to upload to Supabase Storage
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            temp_file.write(content)
            temp_path = temp_file.name
        
        try:
            # Upload physical file to Supabase Bucket (Optional backup)
            upload_requirement_file(temp_path, f"{current_user.id}/{file_name}")
        except Exception as e:
            print(f"Warning: Storage upload failed: {e}")
        finally:
            os.remove(temp_path) # Clean up temp file

    # Run AI Pipeline
    ai_result = process_requirements(extracted_text)

    if "status" in ai_result and ai_result["status"] == "error":
        raise HTTPException(status_code=500, detail=ai_result)

    # Save to Database
    try:
        save_generated_specs(
            user_id=current_user.id,
            filename=file_name,
            specs_json=ai_result
        )
    except Exception as e:
        print(f"Database save error: {e}")
        # We don't fail the request here, we still want to return the AI output to the user

    return {
        "message": "Specifications generated successfully.",
        "data": ai_result
    }

# --- Run the Server ---
if __name__ == "__main__":
    import uvicorn
    # Host on 0.0.0.0 and port 7860 (Hugging Face standard)
    uvicorn.run(app, host="0.0.0.0", port=7860)