# 🛡️ Silent Guardian

> A privacy-focused desktop app that monitors apps accessing your camera, microphone, and sensitive resources — built with Electron.js and FastAPI.

## 🚀 Features

- ✅ View all currently running applications
- 🎙️ Detect apps accessing mic and camera (coming soon)
- 🧠 Intelligent detection with AI (future update)
- 🧾 Log history of suspicious activity
- 🔒 Works offline – no data leaves your system

## 🧩 Tech Stack

- **Frontend:** [Electron.js](https://www.electronjs.org/)  
- **Backend:** [FastAPI](https://fastapi.tiangolo.com/)  
- **Process Monitoring:** [psutil](https://pypi.org/project/psutil/)

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/silent-guardian.git
cd silent-guardian

# Guidelines to run the app

-  backend:
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt  # (You can generate it with pip freeze > requirements.txt)
uvicorn main:app --reload

- frontend:
cd frontend
npm install
npm start

