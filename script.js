const defaultRooms = [
    {
        room: "101",
        guest: "Checkout 10:30 AM",
        status: "Needs Cleaning",
        priority: "Urgent",
        staff: "Anil"
    },
    {
        room: "102",
        guest: "Arrival 2:00 PM",
        status: "Cleaning",
        priority: "High",
        staff: "Priya"
    },
    {
        room: "103",
        guest: "Occupied",
        status: "Ready",
        priority: "Normal",
        staff: "Ravi"
    },
    {
        room: "201",
        guest: "Checkout 11:00 AM",
        status: "Inspection",
        priority: "High",
        staff: "Meena"
    },
    {
        room: "202",
        guest: "Repair required",
        status: "Maintenance",
        priority: "Urgent",
        staff: "Anil"
    }
];

let rooms;

try {
    rooms = JSON.parse(localStorage.getItem("hotelRooms")) || defaultRooms;
} catch (error) {
    rooms = defaultRooms;
}

function saveData() {
    localStorage.setItem("hotelRooms", JSON.stringify(rooms));
}

function updateDashboard() {
    document.getElementById("total").textContent = rooms.length;

    document.getElementById("ready").textContent =
        rooms.filter(r => r.status === "Ready").length;

    document.getElementById("cleaning").textContent =
        rooms.filter(r =>
            r.status === "Cleaning" ||
            r.status === "Needs Cleaning"
        ).length;

    document.getElementById("maintenance").textContent =
        rooms.filter(r =>
            r.status === "Maintenance"
        ).length;

    displayRooms();
    displayPriority();
    displayTasks();
}

function displayRooms() {
    const table = document.getElementById("roomTable");
    const search = document.getElementById("search").value.toLowerCase();
    const filter = document.getElementById("filter").value;

    const filtered = rooms.filter(r =>
        r.room.toLowerCase().includes(search) &&
        (filter === "All" || r.status === filter)
    );

    table.innerHTML = "";

    filtered.forEach((r, index) => {
        const actualIndex = rooms.indexOf(r);

        const row = document.createElement("tr");

        const values = [
            "Room " + r.room,
            r.guest,
            r.status,
            r.priority,
            r.staff || "Unassigned"
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");
        const select = document.createElement("select");

        [
            "Needs Cleaning",
            "Cleaning",
            "Inspection",
            "Ready",
            "Maintenance"
        ].forEach(status => {
            const option = document.createElement("option");
            option.value = status;
            option.textContent = status;
            select.appendChild(option);
        });

        select.value = r.status;

        select.addEventListener("change", () => {
            rooms[actualIndex].status = select.value;
            saveData();
            updateDashboard();
        });

        actionCell.appendChild(select);
        row.appendChild(actionCell);
        table.appendChild(row);
    });
}

function displayPriority() {
    const list = document.getElementById("priorityList");

    const pending = rooms.filter(r =>
        r.status !== "Ready" &&
        (r.priority === "Urgent" || r.priority === "High")
    );

    list.innerHTML = "";

    if (pending.length === 0) {
        list.textContent = "No urgent rooms currently.";
        return;
    }

    pending.forEach(r => {
        const div = document.createElement("div");
        div.className = "priority-item";

        const title = document.createElement("strong");
        title.textContent = "Room " + r.room + " - " + r.priority;

        const details = document.createElement("p");
        details.textContent = r.status + " | " + r.staff;

        div.append(title, details);
        list.appendChild(div);
    });
}

function displayTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    const assignments = {};

    rooms.filter(r => r.status !== "Ready").forEach(r => {
        const name = r.staff || "Unassigned";
        assignments[name] = (assignments[name] || 0) + 1;
    });

    Object.entries(assignments).forEach(([name, count]) => {
        const div = document.createElement("div");
        div.className = "task-item";
        div.textContent = name + " - " + count + " pending room(s)";
        list.appendChild(div);
    });

    if (Object.keys(assignments).length === 0) {
        list.textContent = "No pending cleaning tasks.";
    }
}

document.getElementById("roomForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const roomNumber = document.getElementById("roomNumber").value.trim();

    if (!roomNumber) return;

    const roomData = {
        room: roomNumber,
        guest: document.getElementById("guest").value.trim() || "No details",
        status: document.getElementById("roomStatus").value,
        priority: document.getElementById("priority").value,
        staff: document.getElementById("staff").value.trim() || "Unassigned"
    };

    const existing = rooms.find(r =>
        r.room.toLowerCase() === roomNumber.toLowerCase()
    );

    if (existing) {
        Object.assign(existing, roomData);
    } else {
        rooms.push(roomData);
    }

    saveData();
    updateDashboard();

    this.reset();

    document.getElementById("message").textContent =
        "Room saved successfully!";
});

document.getElementById("search").addEventListener("input", displayRooms);
document.getElementById("filter").addEventListener("change", displayRooms);

updateDashboard();