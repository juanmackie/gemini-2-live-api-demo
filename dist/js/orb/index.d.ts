/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { LitElement } from 'lit';
import './visual-3d';
export declare class GdmLiveAudio extends LitElement {
    isRecording: boolean;
    status: string;
    error: string;
    connected: boolean;
    initialized: boolean;
    private client;
    private session;
    private inputAudioContext;
    private outputAudioContext;
    inputNode: GainNode;
    outputNode: GainNode;
    private nextStartTime;
    private mediaStream;
    private sourceNode;
    private scriptProcessorNode;
    private sources;
    static styles: import("lit").CSSResult;
    constructor();
    private initAudio;
    private initClient;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    toggleRecording(): Promise<void>;
    private initSession;
    private updateStatus;
    private updateError;
    startRecording(): Promise<void>;
    stopRecording(): void;
    sendText(text: string): void;
    private reset;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=index.d.ts.map