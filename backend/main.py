from fastapi import FastAPI, HTTPException, Request # FastAPI is used to create an instance of the web server.
from datetime import datetime
import psutil # allows you to get system and process information
import json
# for getting safe apps from json file
import os 
from fastapi.responses import JSONResponse
# importing defined functions
from utils.utils import get_active_audio_apps, is_camera_in_use, log_event
from utils.camera_watcher.camera_watcher import get_camera_processes
from apscheduler.schedulers.background import BackgroundScheduler
from clean_logs import clean_old_logs

app = FastAPI() # Creates an instance of the FastAPI, which is used to define API routes.

scheduler = BackgroundScheduler()
scheduler.add_job(clean_old_logs, "interval", days = 1)
# scheduler.add_job(clean_old_logs, "interval", minutes = 1) # testing with 1 min
scheduler.start()

with open("safe_apps.json") as f:
    SAFE_APPS = json.load(f)

# defining a GET endpoint at /running-apps --> triggered when we visit http://localhost:8000/running-apps 
@app.get("/running-apps")
def get_running_apps():
    apps = []
    for p in psutil.process_iter(['name']): #fetch name attribute
        try:
            name = p.info['name']
            if name:
                apps.append(name)
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            continue # they give empty string "" as process name

    apps = sorted(set(apps), key=str.lower)  # sort alphabetically (case-insensitive) and remove duplicates
    return {"running_apps": apps}

@app.get("/active-devices")
def detect_devices():
    mic_apps = get_active_audio_apps()
    cam_active = is_camera_in_use()
    # print("is camera active: ", cam_active)
    cam_apps = get_camera_processes() if cam_active else []
    # cam_apps = []
    print("cam_apps: ", cam_apps)

    suspicious = [app for app in mic_apps if app.lower() not in SAFE_APPS["mic_apps"]]
    
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
    file_path = os.path.join(os.path.dirname(__file__), "logs", "access_logs.txt")
    with open(file_path, "r") as f:
        return {"logs": f.readlines()}
    
@app.get("/safe-apps")
def get_safe_apps():
    file_path = os.path.join(os.path.dirname(__file__), "safe_apps.json")
    try:
        with open(file_path, "r") as f:
            data = json.load(f)
        # return JSONResponse(content = data)
        return data #FastAPI will automatically convert it into a JSON response with application/json content type and a 200 OK status code.
    except Exception as e:
        return JSONResponse(content = {"error": str(e)}, status_code = 500) # use JSONResponse to manually set status code other than 200
        
    
@app.post("/update-safe-apps")
async def update_safe_apps(request: Request):
    file_path = os.path.join(os.path.dirname(__file__), "safe_apps.json")
    
    try:
        data = await request.json()
        
        mic_apps = data.get("mic_apps")
        camera_apps = data.get("camera_apps")

        if not isinstance(mic_apps, list) or not isinstance(camera_apps, list):
            print("mic_apps and camera_apps should be lists")

        with open(file_path, "w") as f:
            json.dump({
                "mic_apps" : mic_apps,
                "camera_apps": camera_apps
            }, f, indent = 2)

        return {"status": "success", "message": "Safe apps updated"}
    except Exception as e:
        return JSONResponse(content = {"error": str(e)}, status_code = 500)
            


# uvicorn is an ASGI "server" used to run asynchronous Python web apps, especially those built with frameworks like FastAPI and Starlette.

# to activate virtual environment created using venv --> .\venv\Scripts\activate
# to run backend --> uvicorn main:app --reload
