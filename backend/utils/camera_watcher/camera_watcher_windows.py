import subprocess
import re

def get_camera_processes():
    try:
        command = ['backend/tools/handle/handle.exe', '-nobanner']
        result = subprocess.run(command, capture_output = True, text = True)

        pattern = r'pid: (\d+) .*?type: File.*?CameraSensor'
        matches = re.findall(pattern, result.stdout, re.IGNORECASE)

        process_list = []
        for line in result.stdout.splitlines():
            if "CameraSensor" in line or "video" in line:
                parts = line.split(":")
                if len(parts) > 1:
                    app = parts[0].strip()
                    process_list.append(app)
        
        return list(set(process_list))
    
    except Exception as e:
        print(f'[Error] get_camera_processes_windows: {e}')
        return []