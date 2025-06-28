import { ChatManager } from './chat/chat-manager.js';
import { setupEventListeners } from './dom/events.js';

const chatManager = new ChatManager();

// Get the gdm-live-audio element
const gdmLiveAudio = document.querySelector('gdm-live-audio');

// Handle chat-related events from gdmLiveAudio
if (gdmLiveAudio) {
    gdmLiveAudio.addEventListener('transcription', (event) => {
        chatManager.updateStreamingMessage(event.detail);
    });

    gdmLiveAudio.addEventListener('text_sent', (event) => {
        chatManager.finalizeStreamingMessage();
        chatManager.addUserMessage(event.detail);
    });

    gdmLiveAudio.addEventListener('interrupted', () => {
        chatManager.finalizeStreamingMessage();
        if (!chatManager.lastUserMessageType) {
            chatManager.addUserAudioMessage();
        }
    });

    gdmLiveAudio.addEventListener('turn_complete', () => {
        chatManager.finalizeStreamingMessage();
    });
}

setupEventListeners(gdmLiveAudio);

const appContainer = document.querySelector('.app-container');
const settingsBtn = document.getElementById('settingsBtn');

settingsBtn.addEventListener('click', () => {
    appContainer.classList.toggle('hidden');
});
