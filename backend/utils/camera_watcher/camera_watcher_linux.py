import subprocess

def get_camera_processes():
    try:
        result = subprocess.run(['lsof', '/dev/video0'], capture_output = True, text = True)
        lines = result.stdout.split('\n')[1:]
        apps = [line.split()[0] for line in lines if line]
        return list(set(apps))
    except Exception as e:
        print(f"[Error] get_camera_processes_linux: {e}")
        return []