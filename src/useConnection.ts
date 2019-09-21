import { useEffect, useRef, MutableRefObject } from 'react';

function useConnection(debug = false): RTCPeerConnection {
  const pc: MutableRefObject<RTCPeerConnection> = useRef(
    new RTCPeerConnection({
      iceServers: [{ urls: ['stun:stunserver.org'] }],
    }),
  );

  useEffect(() => {
    if (debug) {
      const log = (...args: any[]) => {
        console.log(...args);
      };
      const conn = pc.current;
      conn.addEventListener('connectionstatechange', log);
      conn.addEventListener('datachannel', log);
      conn.addEventListener('icecandidate', log);
      conn.addEventListener('icecandidateerror', log);
      conn.addEventListener('iceconnectionstatechange', log);
      conn.addEventListener('icegatheringstatechange', log);
      conn.addEventListener('negotiationneeded', log);
      conn.addEventListener('signalingstatechange', log);
      conn.addEventListener('statsended', log);
      conn.addEventListener('track', log);
      return function() {
        conn.removeEventListener('connectionstatechange', log);
        conn.removeEventListener('datachannel', log);
        conn.removeEventListener('icecandidate', log);
        conn.removeEventListener('icecandidateerror', log);
        conn.removeEventListener('iceconnectionstatechange', log);
        conn.removeEventListener('icegatheringstatechange', log);
        conn.removeEventListener('negotiationneeded', log);
        conn.removeEventListener('signalingstatechange', log);
        conn.removeEventListener('statsended', log);
        conn.removeEventListener('track', log);
      };
    }
  }, [debug]);

  return pc.current;
}

export default useConnection;
