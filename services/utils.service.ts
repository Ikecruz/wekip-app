import { Buffer } from "buffer";

export const decodeData = (data: string) => {
    return JSON.parse(Buffer.from(data, 'base64').toString('utf8'));
}

export const encodeData = (data: object | string) => {
    return Buffer.from(JSON.stringify(data)).toString('base64');
}