#!/bin/bash

UPLOAD_DOCS=false
DOCKER_BACKEND=false

# Parse arguments
for arg in "$@"
do
  if [ "$arg" == "--upload-docs" ]; then
    UPLOAD_DOCS=true
  fi
  if [ "$arg" == "--docker-backend" ]; then
    DOCKER_BACKEND=true
  fi
done

echo "Starting Qdrant with Docker Compose..."
cd chatbot
docker-compose up -d qdrant
cd ..

echo "Starting client..."
cd client
npm install
npm run dev &
CLIENT_PID=$!
cd ..

echo "Starting server..."
cd server
npm install
npm run run-it &
SERVER_PID=$!
cd ..

echo "Starting calculate service..."
cd calculate
go run main.go &
CALC_PID=$!
cd ..

if [ "$DOCKER_BACKEND" = true ]; then
  echo "Starting chatbot backend API service with Docker Compose..."
  cd chatbot
  docker-compose up -d backend
  cd ..
  BACKEND_PID=""
else
  echo "Setting up Python virtual environment for chatbot backend..."
  cd chatbot/backend
  if [ ! -d "venv" ]; then
    python3 -m venv venv
  fi
  source venv/bin/activate
  pip install --upgrade pip
  pip install -r requirements.txt

  echo "Starting chatbot backend API service..."
  uvicorn app.main:app --host 0.0.0.0 --port 8000 &
  BACKEND_PID=$!
  cd ../..
fi

if [ "$UPLOAD_DOCS" = true ]; then
  echo "Uploading documents to Qdrant..."
  source chatbot/backend/venv/bin/activate
  python chatbot/scripts/upload_subject_docs.py my_docs mysubject
fi

echo "All services started."
echo "Client PID: $CLIENT_PID"
echo "Server PID: $SERVER_PID"
echo "Calculate PID: $CALC_PID"
if [ "$DOCKER_BACKEND" = true ]; then
  echo "Chatbot Backend is running in Docker Compose."
else
  echo "Chatbot Backend PID: $BACKEND_PID"
fi

wait $CLIENT_PID $SERVER_PID $CALC_PID $BACKEND_PID
