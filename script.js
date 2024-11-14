const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Mapping from the pointerId to the current finger position
const ongoingTouches = new Map();
const colors = ["red", "green", "blue"];

function getCanvasCoordinates(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.pageX - rect.left,
        y: event.pageY - rect.top,
    };
}

function handleStart(event) {
    const coords = getCanvasCoordinates(event);
    const touch = {
        pageX: coords.x,
        pageY: coords.y,
        color: colors[ongoingTouches.size % colors.length],
    };
    ongoingTouches.set(event.pointerId, touch);

    ctx.beginPath();
    ctx.arc(touch.pageX, touch.pageY, 4, 0, 2 * Math.PI, false);
    ctx.fillStyle = touch.color;
    ctx.fill();
}

canvas.addEventListener("pointerdown", handleStart, false);

function handleEnd(event) {
    const touch = ongoingTouches.get(event.pointerId);

    if (!touch) {
        console.error(`End: Could not find touch ${event.pointerId}`);
        return;
    }

    const coords = getCanvasCoordinates(event);

    ctx.lineWidth = 4;
    ctx.fillStyle = touch.color;
    ctx.beginPath();
    ctx.moveTo(touch.pageX, touch.pageY);
    ctx.lineTo(coords.x, coords.y);
    ctx.fillRect(coords.x - 4, coords.y - 4, 8, 8);
    ongoingTouches.delete(event.pointerId);
}

canvas.addEventListener("pointerup", handleEnd, false);

function handleCancel(event) {
    const touch = ongoingTouches.get(event.pointerId);

    if (!touch) {
        console.error(`Cancel: Could not find touch ${event.pointerId}`);
        return;
    }

    ongoingTouches.delete(event.pointerId);
}

canvas.addEventListener("pointercancel", handleCancel, false);

function handleMove(event) {
    const touch = ongoingTouches.get(event.pointerId);

    // Event was not started
    if (!touch) {
        return;
    }

    const coords = getCanvasCoordinates(event);

    ctx.beginPath();
    ctx.moveTo(touch.pageX, touch.pageY);
    ctx.lineTo(coords.x, coords.y);
    ctx.lineWidth = 4;
    ctx.strokeStyle = touch.color;
    ctx.stroke();

    const newTouch = {
        pageX: coords.x,
        pageY: coords.y,
        color: touch.color,
    };

    ongoingTouches.set(event.pointerId, newTouch);
}

canvas.addEventListener("pointermove", handleMove, false);

document.getElementById("clear").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});
