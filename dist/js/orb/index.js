/* tslint:disable */
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { GoogleGenAI, Modality } from '@google/genai';
import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { createBlob, decode, decodeAudioData } from './utils';
import './visual-3d';
let GdmLiveAudio = class GdmLiveAudio extends LitElement {
    constructor() {
        super();
        this.isRecording = false;
        this.status = '';
        this.error = '';
        this.connected = false;
        this.initialized = false;
        this.inputAudioContext = new (window.AudioContext ||
            window.webkitAudioContext)({ sampleRate: 16000 });
        this.outputAudioContext = new (window.AudioContext ||
            window.webkitAudioContext)({ sampleRate: 24000 });
        this.inputNode = this.inputAudioContext.createGain();
        this.outputNode = this.outputAudioContext.createGain();
        this.nextStartTime = 0;
        this.sources = new Set();
        this.initClient();
    }
    initAudio() {
        this.nextStartTime = this.outputAudioContext.currentTime;
    }
    async initClient() {
        this.initAudio();
        this.client = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });
        this.outputNode.connect(this.outputAudioContext.destination);
        // this.initSession(); // Session will be initialized on connect
    }
    async connect() {
        if (this.connected)
            return;
        this.updateStatus('Connecting...');
        await this.initSession();
        this.connected = true;
        this.updateStatus('Connected.');
    }
    async disconnect() {
        if (!this.connected)
            return;
        this.session?.close();
        this.connected = false;
        this.isRecording = false;
        this.updateStatus('Disconnected.');
    }
    async toggleRecording() {
        if (this.isRecording) {
            this.stopRecording();
        }
        else {
            this.startRecording();
        }
    }
    async initSession() {
        const model = 'gemini-2.5-flash-preview-native-audio-dialog';
        try {
            this.session = await this.client.live.connect({
                model: model,
                callbacks: {
                    onopen: () => {
                        this.updateStatus('Opened');
                    },
                    onmessage: async (message) => {
                        const audio = message.serverContent?.modelTurn?.parts[0]?.inlineData;
                        const transcription = message.serverContent?.userTurn?.input;
                        const textResponse = message.serverContent?.modelTurn?.parts[0]?.text;
                        const turnEnd = message.serverContent?.turn?.end;
                        if (audio) {
                            this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);
                            const audioBuffer = await decodeAudioData(decode(audio.data), this.outputAudioContext, 24000, 1);
                            const source = this.outputAudioContext.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(this.outputNode);
                            source.addEventListener('ended', () => {
                                this.sources.delete(source);
                            });
                            source.start(this.nextStartTime);
                            this.nextStartTime = this.nextStartTime + audioBuffer.duration;
                            this.sources.add(source);
                        }
                        if (transcription) {
                            this.dispatchEvent(new CustomEvent('transcription', { detail: transcription }));
                        }
                        if (textResponse) {
                            this.dispatchEvent(new CustomEvent('text_sent', { detail: textResponse }));
                        }
                        const interrupted = message.serverContent?.interrupted;
                        if (interrupted) {
                            for (const source of this.sources.values()) {
                                source.stop();
                                this.sources.delete(source);
                            }
                            this.nextStartTime = 0;
                            this.dispatchEvent(new CustomEvent('interrupted'));
                        }
                        if (turnEnd) {
                            this.dispatchEvent(new CustomEvent('turn_complete'));
                        }
                    },
                    onerror: (e) => {
                        this.updateError(e.message);
                    },
                    onclose: (e) => {
                        this.updateStatus('Close:' + e.reason);
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Orus' } },
                        // languageCode: 'en-GB'
                    },
                },
            });
        }
        catch (e) {
            console.error(e);
        }
    }
    updateStatus(msg) {
        this.status = msg;
    }
    updateError(msg) {
        this.error = msg;
    }
    async startRecording() {
        if (this.isRecording) {
            return;
        }
        this.inputAudioContext.resume();
        this.updateStatus('Requesting microphone access...');
        try {
            this.mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false,
            });
            this.updateStatus('Microphone access granted. Starting capture...');
            this.sourceNode = this.inputAudioContext.createMediaStreamSource(this.mediaStream);
            this.sourceNode.connect(this.inputNode);
            const bufferSize = 256;
            this.scriptProcessorNode = this.inputAudioContext.createScriptProcessor(bufferSize, 1, 1);
            this.scriptProcessorNode.onaudioprocess = (audioProcessingEvent) => {
                if (!this.isRecording)
                    return;
                const inputBuffer = audioProcessingEvent.inputBuffer;
                const pcmData = inputBuffer.getChannelData(0);
                this.session.sendRealtimeInput({ media: createBlob(pcmData) });
            };
            this.sourceNode.connect(this.scriptProcessorNode);
            this.scriptProcessorNode.connect(this.inputAudioContext.destination);
            this.isRecording = true;
            this.updateStatus('🔴 Recording... Capturing PCM chunks.');
        }
        catch (err) {
            console.error('Error starting recording:', err);
            this.updateStatus(`Error: ${err.message}`);
            this.stopRecording();
        }
    }
    stopRecording() {
        if (!this.isRecording && !this.mediaStream && !this.inputAudioContext)
            return;
        this.updateStatus('Stopping recording...');
        this.isRecording = false;
        if (this.scriptProcessorNode && this.sourceNode && this.inputAudioContext) {
            this.scriptProcessorNode.disconnect();
            this.sourceNode.disconnect();
        }
        this.scriptProcessorNode = null;
        this.sourceNode = null;
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach((track) => track.stop());
            this.mediaStream = null;
        }
        this.updateStatus('Recording stopped. Click Start to begin again.');
    }
    sendText(text) {
        this.session.sendRealtimeInput({ text: text });
    }
    reset() {
        this.session?.close();
        this.initSession();
        this.updateStatus('Session cleared.');
    }
    render() {
        return html `
      <div>
        <div class="controls">
          <button
            id="resetButton"
            @click=${this.reset}
            ?disabled=${this.isRecording}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="40px"
              viewBox="0 -960 960 960"
              width="40px"
              fill="#ffffff">
              <path
                d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
            </svg>
          </button>
          <button
            id="startButton"
            @click=${this.startRecording}
            ?disabled=${this.isRecording}>
            <svg
              viewBox="0 0 100 100"
              width="32px"
              height="32px"
              fill="#c80000" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="50" />
            </svg>
          </button>
          <button
            id="stopButton"
            @click=${this.stopRecording}
            ?disabled=${!this.isRecording}>
            <svg
              viewBox="0 0 100 100"
              width="32px"
              height="32px"
              fill="#000000" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="100" height="100" rx="15" />
            </svg>
          </button>
        </div>

        <div id="status"> ${this.error} </div>
        <gdm-live-audio-visuals-3d
          .inputNode=${this.inputNode}
          .outputNode=${this.outputNode}></gdm-live-audio-visuals-3d>
      </div>
    `;
    }
};
GdmLiveAudio.styles = css `
    #status {
      position: absolute;
      bottom: 5vh;
      left: 0;
      right: 0;
      z-index: 10;
      text-align: center;
    }

    .controls {
      z-index: 10;
      position: absolute;
      bottom: 10vh;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 10px;

      button {
        outline: none;
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.1);
        width: 64px;
        height: 64px;
        cursor: pointer;
        font-size: 24px;
        padding: 0;
        margin: 0;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      }

      button[disabled] {
        display: none;
      }
    }
  `;
__decorate([
    state()
], GdmLiveAudio.prototype, "isRecording", void 0);
__decorate([
    state()
], GdmLiveAudio.prototype, "status", void 0);
__decorate([
    state()
], GdmLiveAudio.prototype, "error", void 0);
__decorate([
    state()
], GdmLiveAudio.prototype, "connected", void 0);
__decorate([
    state()
], GdmLiveAudio.prototype, "initialized", void 0);
__decorate([
    state()
], GdmLiveAudio.prototype, "inputNode", void 0);
__decorate([
    state()
], GdmLiveAudio.prototype, "outputNode", void 0);
GdmLiveAudio = __decorate([
    customElement('gdm-live-audio')
], GdmLiveAudio);
export { GdmLiveAudio };
//# sourceMappingURL=index.js.map