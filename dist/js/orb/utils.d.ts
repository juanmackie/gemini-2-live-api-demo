/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { Blob } from '@google/genai';
declare function encode(bytes: Uint8Array): string;
declare function decode(base64: string): Uint8Array<ArrayBuffer>;
declare function createBlob(data: Float32Array): Blob;
declare function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer>;
export { createBlob, decode, decodeAudioData, encode };
//# sourceMappingURL=utils.d.ts.map