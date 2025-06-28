/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/**
 * Analyser class for live audio visualisation.
 */
export class Analyser {
    constructor(node) {
        this.bufferLength = 0;
        this.analyser = node.context.createAnalyser();
        this.analyser.fftSize = 32;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        node.connect(this.analyser);
    }
    update() {
        this.analyser.getByteFrequencyData(this.dataArray);
    }
    get data() {
        return this.dataArray;
    }
}
//# sourceMappingURL=analyser.js.map