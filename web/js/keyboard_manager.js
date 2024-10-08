import { getLogDiv, hideLogOverlay, showLogOverlay } from './new_log_manager.js';

// Gets the Euclidean distance between two elements
function getDistance(el1, el2) {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();
    const dx = rect1.left - rect2.left;
    const dy = rect1.top - rect2.top;
    return Math.sqrt(dx * dx + dy * dy);
}

// Finds the closest element in a specific direction
function findClosestElement(current, direction) {
    if (!current || current.tagName === 'BODY' || !current.classList.contains('focusable')) {
        let bttn = document.querySelector('.focusable');
        return bttn;
    }

    const focusableElements = Array.from(document.querySelectorAll('.focusable'));
    const currentRect = current.getBoundingClientRect();

    let closestElement = null;
    let minDistance = Infinity;

    focusableElements.forEach(element => {
        if (element === current) return;

        const rect = element.getBoundingClientRect();
        let valid = false;

        // Check if the element is in the correct direction
        if (direction === 'ArrowRight' && rect.left >= currentRect.right) {
            valid = true;
        } else if (direction === 'ArrowLeft' && rect.right <= currentRect.left) {
            valid = true;
        } else if (direction === 'ArrowUp' && rect.bottom <= currentRect.top) {
            valid = true;
        } else if (direction === 'ArrowDown' && rect.top >= currentRect.bottom) {
            valid = true;
        }

        if (valid) {
            const distance = getDistance(current, element);
            if (distance < minDistance) {
                minDistance = distance;
                closestElement = element;
            }
        }
    });

    return closestElement;
}

function handleArrowNavigation(event) {
    try {
        toggleLogOverlay(event.keyCode);
    }
    catch (e) {
        console.log("Error in Toggling console overlay", e);
    }
    // showPopup('Key pressed: ' + event.key + '\nKeyCode: ' + event.keyCode + '\nCode: ' + event.code);

    switch (event.keyCode) {
        case 461: window.history.back(); break;
    }

    const currentElement = document.activeElement;

    switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
        case 'ArrowUp':
        case 'ArrowLeft':
            const closestElement = findClosestElement(currentElement, event.key);
            if (closestElement) {
                closestElement.focus();
            }
            break;
        case 'Backspace':
            window.history.back();
            break;
        case 'Escape':
            window.history.back();
            break;
        case '461':
            window.history.back();
            break;
        case '0x1CD':
            window.history.back();
            break;
        case 'Enter':
            const clickEvent = new Event('click');
            currentElement.dispatchEvent(clickEvent);
            break;
        default:
            if (!(event.keyCode >= 48 && event.keyCode <= 57)) {
                /// Ignoring digit keys for logging purpose
                console.log('Unhandled Key pressed: ' + event.key + '\nKeyCode: ' + event.keyCode + '\nCode: ' + event.code);
            }
            break;
    }
}

// Shows a popup window
function showPopup(message) {
    console.log(message);
    // Create a custom popup element
    const popup = document.createElement('div');
    popup.innerText = message;

    // Set the popup style
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '20px';
    popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    popup.style.color = 'white';
    popup.style.borderRadius = '10px';
    popup.style.zIndex = '1000';
    popup.style.textAlign = 'center';

    // Append popup to the body
    document.body.appendChild(popup);

    // Remove the popup after 3 seconds
    setTimeout(() => {
        document.body.removeChild(popup);
    }, 3000);
}

const keysToToggle = 1200;
let lastKeys = 0;

/// adds keyCode to lastKeys
/// if lastKeys is equal to keysToToggle, it toggles the log overlay
function toggleLogOverlay(keyCode) {
    if (!(keyCode >= 48 && keyCode <= 57)) {
        lastKeys = 0;
        return;
    }
    lastKeys = lastKeys * 10 + (keyCode - 48);

    let digits = Math.floor(Math.log10(keysToToggle)) + 1;
    let divisor = Math.pow(10, digits);
    lastKeys = lastKeys % divisor;

    if (lastKeys == keysToToggle) {
        lastKeys = 0;
        let logDiv = getLogDiv();
        if (logDiv.style.display == 'none') {
            showLogOverlay();
        } else {
            hideLogOverlay();
        }
    }
}

window.onload = function () {
    getLogDiv();
    document.addEventListener('keydown', handleArrowNavigation);
}