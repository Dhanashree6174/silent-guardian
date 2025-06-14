from utils.platform_utils import get_os

os_name = get_os()

if os_name == "windows":
    print("windows")
    from utils.camera_watcher.camera_watcher_windows import get_camera_processes
elif os_name == "linux":
    print("linux")
    from utils.camera_watcher.camera_watcher_linux import get_camera_processes
elif os_name == "darwin": #macOS
    print("mac")
    from utils.camera_watcher.camera_watcher_mac import get_camera_processes
else:
    print("else")
    def get_camera_processes():
        return []