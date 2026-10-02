import os
import sys
from pathlib import Path

# Ensure root and backend directory are on sys.path for Vercel Serverless Function runtime
CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parent
BACKEND_DIR = PROJECT_ROOT / "backend"

for path in [str(BACKEND_DIR), str(PROJECT_ROOT)]:
    if path not in sys.path:
        sys.path.insert(0, path)

try:
    from backend.app import app
except ImportError:
    from app import app
