import { compressToBase64, decompressFromBase64 } from 'lz-string';

export const encodeContent = (content: string): string => {
    return compressToBase64(content);
};

export const decodeContent = (encoded: string | null): string => {
    if (!encoded) return '';
    try {
        return decompressFromBase64(encoded) || '';
    } catch {
        return '';
    }
};