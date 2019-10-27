const PREFIX = '>>>';
const POSTFIX = '<<<';

export function encode(description: RTCSessionDescription): string {
  return `${PREFIX}${btoa(JSON.stringify(description))}${POSTFIX}`;
}

export function decode(message: string): unknown {
  const matches = new RegExp(`${PREFIX}(.+)${POSTFIX}`).exec(message);
  if (!matches) {
    throw new Error('Message not found between prefix and postfix');
  }
  return JSON.parse(atob(matches[1]));
}
