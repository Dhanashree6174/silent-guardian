import subprocess
import re
import os

def get_camera_processes():
    #tried but not working using handle.exe
    return ["system restrictions: cannot find specific process on windows"]

# def get_camera_processes():
#     try:
#         base_dir = os.path.dirname(__file__)  # Directory of current .py file
#         exe_path = os.path.join(base_dir,"..", "..", "tools", "handle", "handle.exe")
#         exe_path = os.path.normpath(exe_path)
#         command = [exe_path, '-nobanner']
#         print("Exists:", os.path.exists(exe_path))

#         result = subprocess.run(command, capture_output = True, text = True)

#         pattern = r'pid: (\d+) .*?type: File.*?CameraSensor'
#         matches = re.findall(pattern, result.stdout, re.IGNORECASE)

#         process_list = []
#         for line in result.stdout.splitlines():
#             print("line: ", line)
#             # New process section starts here
#             if "pid:" in line and ".exe" in line:
#                 parts = line.split("pid:")
#                 if len(parts) > 1:
#                     current_proc = parts[0].strip()
#             # Device handle line
#             elif any(dev in line.lower() for dev in ["video", "camera", "000000", "input"]):
#                 if current_proc:
#                     process_list.add(current_proc)
        
#         return list(set(process_list))
    
#     except Exception as e:
#         print(f'[Error] get_camera_processes_windows: {e}')
#         return []