export function encode(description: RTCSessionDescription): string {
  return btoa(JSON.stringify(description));
}

export function decode(message: string): RTCSessionDescription {
  return JSON.parse(atob(message));
}
