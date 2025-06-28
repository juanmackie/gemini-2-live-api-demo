/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { LitElement } from 'lit';
/**
 * 3D live audio visual.
 */
export declare class GdmLiveAudioVisuals3D extends LitElement {
    private inputAnalyser;
    private outputAnalyser;
    private camera;
    private backdrop;
    private composer;
    private sphere;
    private prevTime;
    private rotation;
    private _outputNode;
    set outputNode(node: AudioNode);
    get outputNode(): AudioNode;
    private _inputNode;
    set inputNode(node: AudioNode);
    get inputNode(): AudioNode;
    private canvas;
    static styles: import("lit").CSSResult;
    connectedCallback(): void;
    private init;
    private animation;
    protected firstUpdated(): void;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'gdm-live-audio-visuals-3d': GdmLiveAudioVisuals3D;
    }
}
//# sourceMappingURL=visual-3d.d.ts.map