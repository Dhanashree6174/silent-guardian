from datetime import datetime, timedelta
import os

LOG_FILE = os.path.join(os.path.dirname(__file__), "logs", "access_logs.txt")

def clean_old_logs(log_file = LOG_FILE):
    cutoff = datetime.now() - timedelta(days = 30) # calculates the cutoff datetime (i.e. 30 days ago from now) 
    updated_lines = []

    with open(log_file, "r") as f:
        for line in f:
            try:
                timestamp__str = line.split(" - ")[0].strip()
                timestamp_ = datetime.fromisoformat(timestamp__str) # converts the timestamp string from iso format to a datetime object
                if(timestamp_ >= cutoff):
                    updated_lines.append(line)
            except Exception:
                pass # skip malformed lines

    with open(log_file, "w") as f:
        f.writelines(updated_lines)
        print("Log file cleanup done!")

if __name__ == "__main__":
    clean_old_logs() # this ensures the script only runs when executed directly (e.g., via python clean_logs.py), not when it's imported elsewhere.