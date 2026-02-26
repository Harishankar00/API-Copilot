import os
import json
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

load_dotenv()

# 1. Initialize the Base LLM Endpoint
repo_id = "mistralai/Mistral-7B-Instruct-v0.2"
llm = HuggingFaceEndpoint(
    repo_id=repo_id,
    huggingfacehub_api_token=os.getenv("HUGGINGFACEHUB_API_TOKEN"),
    temperature=0.1,
    max_new_tokens=2048,
)

# 2. Wrap it in ChatHuggingFace to force the "conversational" task
chat_model = ChatHuggingFace(llm=llm)

# 3. Define the Structured Output Parser
parser = JsonOutputParser()

# 4. Use ChatPromptTemplate (System + Human message format)
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an expert Product Manager. You strictly output valid JSON. Do not include markdown blocks like ```json."),
    ("human", """Convert the following requirements into a structured JSON format.

RAW REQUIREMENTS:
{raw_input}

Return ONLY a valid JSON object with this exact structure:
{{
    "modules": ["feature 1", "feature 2"],
    "user_stories": ["As a... I want to..."],
    "api_specs": [{{"method": "GET", "path": "/url", "description": "text"}}],
    "db_schema": [{{"table": "name", "columns": ["col1", "col2"]}}],
    "edge_cases": ["case 1"]
}}""")
])

# 5. The Production Chain
chain = prompt | chat_model | parser

def process_requirements(text_content: str):
    """
    Takes raw text and returns structured specs.
    """
    try:
        result = chain.invoke({"raw_input": text_content})
        return result
    except Exception as e:
        print(f"Error in AI Pipeline: {e}")
        return {
            "status": "error",
            "message": "Failed to parse requirements.",
            "details": str(e)
        }

# --- Verification ---
if __name__ == "__main__":
    test_input = "I want an app where users can buy coffee and pay with credit cards. Admin should see orders."
    print("Testing Pipeline...")
    output = process_requirements(test_input)
    print(json.dumps(output, indent=2))