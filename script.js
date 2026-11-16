
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

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const span = document.createElement("span");
    span.textContent = " " + taskText;

    checkbox.addEventListener("change", function() {
        span.style.textDecoration = checkbox.checked
            ? "line-through"
            : "none";
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "حذف";

    deleteButton.addEventListener("click", function() {
        li.remove();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteButton);

    taskList.appendChild(li);

    taskInput.value = "";
}

addTaskButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});// حرکت هاله نورانی با موس
document.addEventListener("mousemove", function(event) {
    document.documentElement.style.setProperty(
        "--mouse-x",
        event.clientX + "px"
    );

    document.documentElement.style.setProperty(
        "--mouse-y",
        event.clientY + "px"
    );
});document.addEventListener("mousemove", function(event) {
    const drop = document.createElement("div");

    drop.className = "water-drop";
    drop.style.left = event.clientX + "px";
    drop.style.top = event.clientY + "px";

    document.body.appendChild(drop);

    setTimeout(function() {
        drop.remove();
    }, 800);
});