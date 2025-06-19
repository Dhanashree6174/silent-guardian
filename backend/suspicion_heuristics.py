from datetime import datetime, timedelta
from collections import defaultdict

# If many unknown(unsafe) apps access the mic/cam in a short time window, alert the user.

def detect_multiple_unknowns(log_lines, safe_apps, recent_minutes=30):
    now = datetime.now()
    window_start = now - timedelta(minutes=recent_minutes)
    unknown_counts = defaultdict(int)
    last_seen = {}
    print("ws: ", window_start)

    for line in log_lines:
        try:
            timestamp_str, rest = line.split(" - ")
            timestamp = datetime.fromisoformat(timestamp_str.strip())
           
            if timestamp >= window_start:
                app = rest.split(" accessed")[0].strip()
            
                if "microphone" in rest:
                    if app.lower() not in safe_apps:
                        unknown_counts[app] += 1
                        last_seen[app] = timestamp
                if "camera" in rest:
                    unknown_counts["some camera app"] += 1
                    last_seen["some camera app"] = timestamp

        except Exception as e:
            pass

        # print(unknown_counts)

    return [
            {"name": app, "reason": "Multiple accesses", "lastSeeen": str(last_seen[app])}
            for app, count in unknown_counts.items() if count > 1]

# access for > X minutes = suspicious
# check if multiple logs are close together (e.g., within 5-minute intervals)

def detect_long_access(log_lines, threshold_minutes=10):

    app_timestamps = defaultdict(list)

    for line in log_lines:
        try:
            timestamp_str, rest = line.split(" - ")
            timestamp = datetime.fromisoformat(timestamp_str.strip())
            app = rest.split(" accessed")[0].strip()
            if "microphone" in rest:
                app_timestamps[app].append(timestamp)
            if "camera" in rest:
                app_timestamps["some camera app"].append(timestamp)
        except:
            pass

    suspicious_apps = []
    for app, timestamps in app_timestamps.items():
        timestamps.sort()
        for i in range(1, len(timestamps)):
            diff = (timestamps[i] - timestamps[i-1]).total_seconds() / 60
            if diff < threshold_minutes:
                suspicious_apps.append({
                    "name": app,
                    "reason": f"Accessed repeatedly within {threshold_minutes} mins",
                    "lastSeen": str(timestamps[i])
                })
                break # No need to check further once flagged

    return suspicious_apps