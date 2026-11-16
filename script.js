
function updateClock() {
    const now = new Date();

    const time = now.toLocaleTimeString("en-GB");

    document.getElementById("clock").textContent = time;
}

setInterval(updateClock, 1000);

updateClock();


const display = document.getElementById("calc-display");
const buttons = document.querySelector(".calculator-buttons");

if (display && buttons) {
    let current = "0";
    let firstNumber = null;
    let operator = null;
    let waiting = false;

    function show() {
        display.value = current;
    }

    buttons.addEventListener("click", function(event) {
        const button = event.target.closest("button");
        if (!button) return;

        const action = button.dataset.action;
        const value = button.dataset.value;

        if (action === "clear") {
            current = "0";
            firstNumber = null;
            operator = null;
            waiting = false;
            show();
            return;
        }

        if (action === "delete") {
            if (!waiting) {
                current = current.length > 1
                    ? current.slice(0, -1)
                    : "0";
                show();
            }
            return;
        }

        if (action === "equals") {
            if (operator === null || firstNumber === null) return;

            const second = Number(current);
            let result;

            if (operator === "+") result = firstNumber + second;
            if (operator === "-") result = firstNumber - second;
            if (operator === "*") result = firstNumber * second;
            if (operator === "/") {
                if (second === 0) {
                    current = "خطا";
                    show();
                    operator = null;
                    firstNumber = null;
                    waiting = true;
                    return;
                }
                result = firstNumber / second;
            }

            current = String(Number(result.toFixed(8)));
            firstNumber = null;
            operator = null;
            waiting = true;
            show();
            return;
        }

        if (value === undefined) return;

        if ("+-*/".includes(value)) {
            if (operator !== null && !waiting) {
                const second = Number(current);
                if (operator === "+") firstNumber += second;
                if (operator === "-") firstNumber -= second;
                if (operator === "*") firstNumber *= second;
                if (operator === "/" && second !== 0) firstNumber /= second;
                current = String(firstNumber);
            } else {
                firstNumber = Number(current);
            }

            operator = value;
            waiting = true;
            show();
            return;
        }

        if (waiting || current === "خطا") {
            current = value === "." ? "0." : value;
            waiting = false;
        } else if (value === ".") {
            if (!current.includes(".")) current += ".";
        } else {
            current = current === "0" ? value : current + value;
        }

        show();
    });
}
function showDate() {
    const today = new Date();

    const date = today.toLocaleDateString("fa-IR");

    document.getElementById("today-date").textContent = date;
}

showDate();

// بخش کارهای روزانه
const taskInput = document.getElementById("task-input");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");

function saveTasks() {
    const tasks = [];

    taskList.querySelectorAll("li").forEach(function(li) {
        tasks.push({
            text: li.querySelector("span").textContent,
            completed: li.querySelector('input[type="checkbox"]').checked
        });
    });

    localStorage.setItem("parsaTasks", JSON.stringify(tasks));
}

function createTask(text, completed = false) {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed;

    const span = document.createElement("span");
    span.textContent = text;
    span.style.textDecoration = completed ? "line-through" : "none";

    checkbox.addEventListener("change", function() {
        span.style.textDecoration = checkbox.checked ? "line-through" : "none";
        saveTasks();
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "حذف";

    deleteButton.addEventListener("click", function() {
        li.remove();
        saveTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteButton);
    taskList.appendChild(li);
}

function addTask() {
    const text = taskInput.value.trim();

    if (text === "") return;

    createTask(text);
    taskInput.value = "";
    saveTasks();
}

addTaskButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

const savedTasks = JSON.parse(localStorage.getItem("parsaTasks") || "[]");

savedTasks.forEach(function(task) {
    createTask(task.text, task.completed);
});


document.addEventListener("mousemove", function(event) {
    document.documentElement.style.setProperty(
        "--mouse-x",
        event.clientX + "px"
    );

    document.documentElement.style.setProperty(
        "--mouse-y",
        event.clientY + "px"
    );
});

document.addEventListener("mousemove", function(event) {
    const drop = document.createElement("div");

    drop.className = "water-drop";
    drop.style.left = event.clientX + "px";
    drop.style.top = event.clientY + "px";

    document.body.appendChild(drop);

    setTimeout(function() {
        drop.remove();
    }, 800);
});// سیستم هشدار پارسا تک
const alarmTime = document.getElementById("alarm-time");
const setAlarmButton = document.getElementById("set-alarm");
const alarmMessage = document.getElementById("alarm-message");

let activeAlarm = null;
let lastAlarm = "";

setAlarmButton.addEventListener("click", function() {
    if (alarmTime.value === "") {
        alarmMessage.textContent = "لطفاً ساعت هشدار را انتخاب کن!";
        return;
    }

    activeAlarm = alarmTime.value;
    lastAlarm = "";

    alarmMessage.textContent = "هشدار برای ساعت " + activeAlarm + " تنظیم شد! 🔔";
});

setInterval(function() {
    if (activeAlarm === null) return;

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);

    if (currentTime === activeAlarm && lastAlarm !== currentTime + now.toDateString()) {
        lastAlarm = currentTime + now.toDateString();
       playAlarmSound(); 
        alert("⏰ پارسا تک: زمان هشدار فرا رسیده!");
        activeAlarm = null;
        alarmMessage.textContent = "هشدار به پایان رسید.";
    }
}, 1000);

function playAlarmSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.type = "sine";
    oscillator.frequency.value = 880;

    gain.gain.value = 0.3;

    oscillator.start();

    setTimeout(function() {
        oscillator.stop();
        audioContext.close();
    }, 1500);
}
