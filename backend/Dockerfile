# Use a lightweight Python image
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Manually install PyPDF2 just to be safe for your file uploads
RUN pip install PyPDF2

# Copy all the rest of your Python files into the container
COPY . .

# Hugging Face Spaces STRICTLY expects the app to run on port 7860
EXPOSE 7860

# Start the FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]