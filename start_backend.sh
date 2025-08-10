#!/bin/bash

echo "Starting AGI Cosmic Backend..."

# Export PATH to include local bin
export PATH=$PATH:/home/ubuntu/.local/bin

# Change to workspace directory
cd /workspace

# Start uvicorn server
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000