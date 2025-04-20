const fetchRunningApps = async () => {
  fetch("http://127.0.0.1:8000/running-apps")
    .then((res) => res.json())
    .then((data) => {
      const ul = document.getElementById("appList");
      data.running_apps.forEach((app) => {
        const li = document.createElement("li");
        li.textContent = app;
        ul.appendChild(li);
      });
    });
};

fetchRunningApps();

const fetchAudioUsageData = async () => {
  try{
    const res = await fetch("http://127.0.0.1:8000/active-devices");
    const data = await res.json();
    const activeVoiceAppsList = document.getElementById("activeVoiceApps");
    activeVoiceAppsList.innerHTML = "";

    data.mic_apps.forEach((app) => {
      const li = document.createElement("li");
      li.textContent = app;
      activeVoiceAppsList.appendChild(li);

      if (data.suspicious.includes(app)) {
        new Notification("⚠️ Suspicious Mic Access", {
          body: `${app} is using the mic!`,
        });
      }
    });

    const camStatus = document.getElementById("cam-status");
    if(data.camera_active){
      camStatus.textContent = "🟥 Camera is in use!";
      new Notification("📸 Camera Alert", {
        body: `Camera is currently active!`,
      });
    } else{
      camStatus.textContent = "🟩 Camera is idle."
    }
  } catch(err){
    console.error("Error fetching device status: ", err);
  }
};

fetchAudioUsageData();

// setInterval(fetchAudioUsageData, 3000);
