from pycaw.pycaw import AudioUtilities
from datetime import datetime
import pythoncom

def get_active_audio_apps():
    pythoncom.CoInitialize() #pycaw uses COM apis for windows
    try:
        sessions = AudioUtilities.GetAllSessions()
        # print("sessions: ", sessions)
        active_apps = []
        for session in sessions:
            print("details: ", session.Process)
            if(session.Process and session.SimpleAudioVolume.GetMasterVolume() > 0):
                active_apps.append(session.Process.name())
            print("active_apps: ", active_apps)
        return active_apps
    finally:
        pythoncom.CoUninitialize()
    
def log_event(app, device):
    with open("logs/access_logs.txt", "a") as f:
        f.write(f"{datetime.now()} - {app} accessed {device}\n")


# pip install pywin32 pycaw