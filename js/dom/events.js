import elements from './elements.js';
import settingsManager from '../settings/settings-manager.js';

/**
 * Updates UI to show disconnect button and hide connect button
 */
const showDisconnectButton = () => {
    elements.connectBtn.style.display = 'none';
    elements.disconnectBtn.style.display = 'block';
};

/**
 * Updates UI to show connect button and hide disconnect button
 */
const showConnectButton = () => {
    elements.disconnectBtn.style.display = 'none';
    elements.connectBtn.style.display = 'block';
};

let isCameraActive = false;

/**
 * Sets up event listeners for the application's UI elements
 * @param {HTMLElement} gdmLiveAudio - The gdm-live-audio custom element instance
 */
export function setupEventListeners(gdmLiveAudio) {
    // Disconnect handler
    elements.disconnectBtn.addEventListener('click', async () => {
        try {
            await gdmLiveAudio.disconnect();
            showConnectButton();
            [elements.cameraBtn, elements.screenBtn, elements.micBtn].forEach(btn => btn.classList.remove('active'));
            isCameraActive = false;
        } catch (error) {
            console.error('Error disconnecting:', error);
        }
    });

    // Connect handler
    elements.connectBtn.addEventListener('click', async () => {
        try {
            await gdmLiveAudio.connect();
            showDisconnectButton();
        } catch (error) {
            console.error('Error connecting:', error);
        }
    });

    // Microphone toggle handler
    elements.micBtn.addEventListener('click', async () => {
        try {
            await gdmLiveAudio.toggleRecording();
            elements.micBtn.classList.toggle('active');
        } catch (error) {
            console.error('Error toggling microphone:', error);
            elements.micBtn.classList.remove('active');
        }
    });

    // Camera toggle handler (functionality to be re-implemented)
    elements.cameraBtn.addEventListener('click', async () => {
        const password = prompt("Please enter the password to access the camera:");
        if (password !== "Geoffrey14") {
            if (password !== null) alert("Incorrect password.");
            return;
        }
        console.warn("Camera functionality needs to be re-implemented with gdm-live-audio.");
    });

    // Screen sharing handler (functionality to be re-implemented)
    elements.screenBtn.addEventListener('click', async () => {
        const password = prompt("Please enter the password to access screen sharing:");
        if (password !== "Geoffrey14") {
            if (password !== null) alert("Incorrect password.");
            return;
        }
        console.warn("Screen sharing functionality needs to be re-implemented with gdm-live-audio.");
    });

    // Message sending handlers
    const sendMessage = async () => {
        try {
            const text = elements.messageInput.value.trim();
            if (text) {
                await gdmLiveAudio.sendText(text);
                elements.messageInput.value = '';
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    elements.sendBtn.addEventListener('click', sendMessage);
    elements.messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });

    // Settings button click
    elements.settingsBtn.addEventListener('click', () => {
        const password = prompt("Please enter the password to access settings:");
        // TODO: Use a more secure method for password storage and validation
        if (password === "Geoffrey14") {
            settingsManager.show();
        } else if (password !== null) { // Only alert if the user entered something incorrect, not if they cancelled
            alert("Incorrect password.");
        }
    });
}

// Initialize settings
settingsManager;
