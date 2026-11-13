
// Select clock elements
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");
const ampmElement = document.getElementById("ampm");

// Select alarm input elements
const alarmHoursInput = document.getElementById("alarm-hours");
const alarmMinutesInput = document.getElementById("alarm-minutes");
const alarmSecondsInput = document.getElementById("alarm-seconds");
const alarmAmPmInput = document.getElementById("alarm-ampm");
const setAlarmButton = document.getElementById("set-alarm-btn");

// Select alarm list elements
const alarmListElement = document.getElementById("alarm-list");
const emptyMessageElement = document.getElementById("empty-message");

// Store all active alarms
const alarms = [];
let nextAlarmId = 1;

// Format a time value with a leading zero
function formatTime(value) {
    return String(value).padStart(2, "0");
}

// Convert 24-hour time into 12-hour time
function getCurrentTime() {
    const now = new Date();

    const hours24 = now.getHours();
    const hours = hours24 % 12 || 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours24 >= 12 ? "PM" : "AM";

    return { hours, minutes, seconds, ampm };
}

// Update the digital clock
function updateClock() {
    const currentTime = getCurrentTime();

    hoursElement.textContent = formatTime(currentTime.hours);
    minutesElement.textContent = formatTime(currentTime.minutes);
    secondsElement.textContent = formatTime(currentTime.seconds);
    ampmElement.textContent = currentTime.ampm;
}

// Validate alarm input values
function validateAlarmInputs() {
    const hourValue = alarmHoursInput.value.trim();
    const minuteValue = alarmMinutesInput.value.trim();
    const secondValue = alarmSecondsInput.value.trim();
    const ampm = alarmAmPmInput.value;

    // Check for missing values
    if (hourValue === "" || minuteValue === "" || secondValue === "") {
        alert("Please enter hours, minutes, and seconds.");
        return null;
    }

    const hours = Number(hourValue);
    const minutes = Number(minuteValue);
    const seconds = Number(secondValue);

    // Validate hours
    if (!Number.isInteger(hours) || hours < 1 || hours > 12) {
        alert("Please enter an hour between 1 and 12.");
        return null;
    }

    // Validate minutes
    if (!Number.isInteger(minutes) || minutes < 0 || minutes > 59) {
        alert("Please enter minutes between 0 and 59.");
        return null;
    }

    // Validate seconds
    if (!Number.isInteger(seconds) || seconds < 0 || seconds > 59) {
        alert("Please enter seconds between 0 and 59.");
        return null;
    }

    // Validate AM/PM
    if (ampm !== "AM" && ampm !== "PM") {
        alert("Please select AM or PM.");
        return null;
    }

    return { hours, minutes, seconds, ampm };
}

// Display the alarm list
function renderAlarms() {
    alarmListElement.innerHTML = "";

    // Show the empty message when no alarms exist
    if (alarms.length === 0) {
        emptyMessageElement.style.display = "block";
        return;
    }

    emptyMessageElement.style.display = "none";

    // Create an item for each active alarm
    alarms.forEach(function (alarm) {
        const alarmTime =
            `${formatTime(alarm.hours)}:` +
            `${formatTime(alarm.minutes)}:` +
            `${formatTime(alarm.seconds)} ${alarm.ampm}`;

        const alarmItem = document.createElement("div");
        alarmItem.className = "alarm-item";

        const alarmTimeElement = document.createElement("span");
        alarmTimeElement.textContent = alarmTime;

        // Create the Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.dataset.id = alarm.id;

        deleteButton.addEventListener("click", function () {
            deleteAlarm(Number(deleteButton.dataset.id));
        });

        alarmItem.appendChild(alarmTimeElement);
        alarmItem.appendChild(deleteButton);

        alarmListElement.appendChild(alarmItem);
    });
}

// Add a new alarm
function addAlarm(alarmTime) {
    const alarm = {
        id: nextAlarmId++,
        hours: alarmTime.hours,
        minutes: alarmTime.minutes,
        seconds: alarmTime.seconds,
        ampm: alarmTime.ampm,
        fired: false
    };

    // Save the alarm
    alarms.push(alarm);

    // Update the list
    renderAlarms();

    // Reset alarm inputs
    alarmHoursInput.value = "";
    alarmMinutesInput.value = "";
    alarmSecondsInput.value = "";
    alarmAmPmInput.selectedIndex = 0;

    alert("Alarm added successfully.");

}

// Delete an alarm using its ID
function deleteAlarm(alarmId) {
    const alarmIndex = alarms.findIndex(function (alarm) {
        return alarm.id === alarmId;
    });

    if (alarmIndex === -1) {
        return;
    }

    // Remove the alarm from the active list
    alarms.splice(alarmIndex, 1);

    renderAlarms();

}

// Compare the current time with all active alarms
function checkAlarms(currentTime) {
    // Find alarms matching the current time
    const ringingAlarms = alarms.filter(function (alarm) {
        return (
            !alarm.fired &&
            alarm.hours === currentTime.hours &&
            alarm.minutes === currentTime.minutes &&
            alarm.seconds === currentTime.seconds &&
            alarm.ampm === currentTime.ampm
        );
    });

    // Stop if no alarms match
    if (ringingAlarms.length === 0) {
        return;
    }

    // Mark matching alarms as fired
    ringingAlarms.forEach(function (alarm) {
        alarm.fired = true;
    });

    // Remove fired alarms before displaying alerts
    ringingAlarms.forEach(function (alarm) {
        deleteAlarm(alarm.id);
    });

    // Display an alert for each matching alarm
    ringingAlarms.forEach(function (alarm) {
        const alarmTime =
            `${formatTime(alarm.hours)}:` +
            `${formatTime(alarm.minutes)}:` +
            `${formatTime(alarm.seconds)} ${alarm.ampm}`;

        alert(`Alarm ringing! ${alarmTime}`);
    });
}

// Update the clock and check alarms
function runClock() {
    const currentTime = getCurrentTime();

    updateClock();
    checkAlarms(currentTime);
}

// Handle the Set Alarm button
setAlarmButton.addEventListener("click", function () {
    const alarmTime = validateAlarmInputs();

    if (!alarmTime) {
        return;
    }

    addAlarm(alarmTime);
});

// Initialize the clock and alarm list
renderAlarms();
runClock();

// Update the clock and check alarms every second
setInterval(runClock, 1000);
