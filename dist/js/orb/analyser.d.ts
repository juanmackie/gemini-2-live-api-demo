/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/**
 * Analyser class for live audio visualisation.
 */
export declare class Analyser {
    private analyser;
    private bufferLength;
    private dataArray;
    constructor(node: AudioNode);
    update(): void;
    get data(): Uint8Array<ArrayBufferLike>;
}
//# sourceMappingURL=analyser.d.ts.map