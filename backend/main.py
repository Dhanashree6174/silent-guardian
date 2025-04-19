from fastapi import FastAPI # FastAPI is used to create an instance of the web server.
from datetime import datetime
import psutil # allows you to get system and process information
import json
from utils import get_active_audio_apps, log_event

app = FastAPI() # Creates an instance of the FastAPI, which is used to define API routes.

with open("safe_apps.json") as f:
    SAFE_APPS = json.load(f)

# defining a GET endpoint at /running-apps --> triggered when we visit http://localhost:8000/running-apps 
@app.get("/running-apps")
def get_running_apps():
    apps = [p.name() for p in psutil.process_iter()] # Loops through all running processes
    return {"running_apps": apps}

@app.get("/active-devices")
def detect_devices():
    mic_apps = get_active_audio_apps()
    suspicious = [app for app in mic_apps if app.lower() not in SAFE_APPS["microphone"]]
    
    for app in suspicious:
        log_event(app, "microphone")
    
    return {"mic_apps": mic_apps, "suspicious": suspicious}

@app.get("/logs")
def get_logs():
    with open("logs/access_logs.txt") as f:
        return {"logs": f.readlines}

# uvicorn is an ASGI "server" used to run asynchronous Python web apps, especially those built with frameworks like FastAPI and Starlette.

# to activate virtual environment created using venv --> .\venv\Scripts\activate
