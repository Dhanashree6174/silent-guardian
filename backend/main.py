from fastapi import FastAPI # FastAPI is used to create an instance of the web server.
from datetime import datetime
import psutil # allows you to get system and process information

app = FastAPI() # Creates an instance of the FastAPI, which is used to define API routes.

# defining a GET endpoint at /running-apps --> triggered when we visit http://localhost:8000/running-apps 
@app.get("/running-apps")
def get_running_apps():
    apps = [p.name() for p in psutil.process_iter()] # Loops through all running processes
    return {"running_apps": apps}

# uvicorn is an ASGI "server" used to run asynchronous Python web apps, especially those built with frameworks like FastAPI and Starlette.