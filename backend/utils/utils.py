from pycaw.pycaw import AudioUtilities
from datetime import datetime
import pythoncom
import cv2

def get_active_audio_apps():
    pythoncom.CoInitialize() #pycaw uses COM apis for windows
    try:
        sessions = AudioUtilities.GetAllSessions()
        # print("sessions: ", sessions)
        active_apps = []
        for session in sessions:
            # print("details: ", session.Process)
            if(session.Process and session.Process.name() and session.SimpleAudioVolume.GetMasterVolume() > 0):
                active_apps.append(session.Process.name())
            print("active_apps: ", active_apps)
        return active_apps
    finally:
        pythoncom.CoUninitialize()

def is_camera_in_use():
    cap = cv2.VideoCapture(0)
    if not cap or not cap.isOpened():
        return True # if we can't access it, someone else might be using it
    ret, frame = cap.read()
    cap.release()
    return False if ret else True
    
def log_event(app, device):
    with open("logs/access_logs.txt", "a") as f:
        f.write(f"{datetime.now()} - {app} accessed {device}\n")



# pip install pywin32 pycaw --> to check if mic/audio is in use
# pip install opencv-python --> to check if camera is in use