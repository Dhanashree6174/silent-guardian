from fastapi import FastAPI # FastAPI is used to create an instance of the web server.
from datetime import datetime
import psutil # allows you to get system and process information
import json
# for getting safe apps from json file
import os 
from fastapi.responses import JSONResponse
# importing defined functions
from utils.utils import get_active_audio_apps, is_camera_in_use, log_event
from utils.camera_watcher.camera_watcher import get_camera_processes

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
    cam_active = is_camera_in_use()
    # print("is camera active: ", cam_active)
    # cam_apps = get_camera_processes() if cam_active else []
    cam_apps = []

    suspicious = [app for app in mic_apps if app.lower() not in SAFE_APPS["microphone"]]
    
    for app in suspicious:
        log_event(app, "microphone")
    if cam_active and not cam_apps:
        log_event("Unkown", "camera")
    for app in cam_apps:
        log_event(app, "camera")

    
    return {
        "mic_apps": mic_apps, 
        "suspicious": suspicious,
        "camera_active": cam_active,
        "camera_apps": cam_apps
        }

@app.get("/logs")
def get_logs():
    with open("logs/access_logs.txt") as f:
        return {"logs": f.readlines}
    
@app.get("/safe-apps")
def get_safe_apps():
    file_path = os.path.join(os.path.dirname(__file__), "safe_apps.json")
    try:
        with open(file_path, "r") as f:
            data = json.load(f)
        return JSONResponse(content = data)
    except Exception as e:
        return JSONResponse(content = {"error": str(e)}, status_code = 500)


# uvicorn is an ASGI "server" used to run asynchronous Python web apps, especially those built with frameworks like FastAPI and Starlette.

# to activate virtual environment created using venv --> .\venv\Scripts\activate
# to run backend --> uvicorn main:app --reload
