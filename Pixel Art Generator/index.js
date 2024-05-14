// Selecting DOM elements
let container = document.querySelector(".container"); // Container for grid
let gridButton = document.getElementById("submit-grid"); // Button to submit grid dimensions
let clearGridButton = document.getElementById("clear-grid"); // Button to clear the grid
let gridWidth = document.getElementById("width-range"); // Input range for grid width
let gridHeight = document.getElementById("height-range"); // Input range for grid height
let colorButton = document.getElementById("color-input"); // Input for color selection
let eraseBtn = document.getElementById("erase-btn"); // Button to activate erase mode
let paintBtn = document.getElementById("paint-btn"); // Button to activate paint mode
let widthValue = document.getElementById("width-value"); // Display for grid width value
let heightValue = document.getElementById("height-value"); // Display for grid height value

// Events for mouse and touch interactions
let events = {
    mouse: {
        down: "mousedown",
        move: "mousemove",
        up: "mouseup"
    },
    touch: {
        down: "touchstart",
        move: "touchmove",
        up: "touchend",
    },
};

// Variable to store device type (mouse or touch)
let deviceType = "";

// Variables to control drawing and erasing modes
let draw = false;
let erase = false;

// Function to check if the device is a touch device
const isTouchDevice = () => {
    try {
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
    } catch (e) {
        deviceType = "mouse";
        return false;
    }
};

// Check if the device is touch-enabled
isTouchDevice();

// Event listener for grid submission
gridButton.addEventListener("click", () => {
    container.innerHTML = ""; // Clear previous grid
    let count = 0; // Counter for grid column IDs
    for (let i = 0; i < gridHeight.value; i++) {
        count += 2;
        let div = document.createElement("div"); // Create grid row element
        div.classList.add("gridRow");

        for (let j = 0; j < gridWidth.value; j++) {
            count += 2;
            let col = document.createElement("div"); // Create grid column element
            col.classList.add("gridCol");
            col.setAttribute("id", `gridCol${count}`); // Set unique ID for each column
            col.addEventListener(events[deviceType].down, () => {
                draw = true; // Start drawing on mouse/touch down
                if (erase) {
                    col.style.backgroundColor = "transparent"; // Erase mode: set background to transparent
                } else {
                    col.style.backgroundColor = colorButton.value; // Paint mode: set background to selected color
                }
            });

            col.addEventListener(events[deviceType].move, (e) => {
                let elementId = document.elementFromPoint(
                    !isTouchDevice() ? e.clientX : e.touches[0].clientX,
                    !isTouchDevice() ? e.clientY : e.touches[0].clientY,
                ).id;
                checker(elementId); // Check and update color on mouse/touch move
            });

            col.addEventListener(events[deviceType].up, () => {
                draw = false; // Stop drawing on mouse/touch up
            });

            div.appendChild(col); // Append column to row
        }

        container.appendChild(div); // Append row to container
    }
});

// Function to update color of grid elements
function checker(elementId) {
    let gridColumns = document.querySelectorAll(".gridCol");
    gridColumns.forEach((element) => {
        if (elementId == element.id) {
            if (draw && !erase) {
                element.style.backgroundColor = colorButton.value; // Paint mode
            } else if (draw && erase) {
                element.style.backgroundColor = "transparent"; // Erase mode
            }
        }
    });
}

// Event listener to clear the grid
clearGridButton.addEventListener("click", () => {
    container.innerHTML = "";
});

// Event listener to activate erase mode
eraseBtn.addEventListener("click", () => {
    erase = true;
});

// Event listener to activate paint mode
paintBtn.addEventListener("click", () => {
    erase = false;
});

// Event listener for grid width input change
gridWidth.addEventListener("input", () => {
    widthValue.innerHTML = gridWidth.value < 9 ? `0${gridWidth.value}` : gridWidth.value; // Update displayed width value
});

// Event listener for grid height input change
gridHeight.addEventListener("input", () => {
    heightValue.innerHTML = gridHeight.value < 9 ? `0${gridHeight.value}` : gridHeight.value; // Update displayed height value
});

// Function to initialize grid dimensions on window load
window.onload = () => {
    gridHeight.value = 0;
    gridWidth.value = 0;
};
