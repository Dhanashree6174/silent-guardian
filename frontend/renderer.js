fetch("http://127.0.0.1:8000/running-apps")
.then((res) => res.json())
.then((data) => {
    const ul = document.getElementById("appList");
    data.running_apps.forEach((app) => {
        const li = document.createElement('li');
        li.textContent = app;
        ul.appendChild(li);
    });
});