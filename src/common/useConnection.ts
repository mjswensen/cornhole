import { useEffect, useRef, MutableRefObject, useState } from 'react';

function useConnection(
  debug = false,
): [RTCPeerConnection, RTCDataChannel, boolean] {
  // Connection ref

  const pcRef: MutableRefObject<RTCPeerConnection> = useRef(
    new RTCPeerConnection({
      iceServers: [{ urls: ['stun:stunserver.org'] }],
    }),
  );
  const pc = pcRef.current;

  // Channel ref

  const channelRef: MutableRefObject<RTCDataChannel> = useRef(
    pc.createDataChannel('cornhole'),
  );
  const channel = channelRef.current;

  // Connected state

  const [connected, setConnected] = useState(false);
  useEffect(() => {
    const setConnectedTrue = () => {
      setConnected(true);
    };
    channel.addEventListener('open', setConnectedTrue);
    return () => {
      channel.removeEventListener('open', setConnectedTrue);
    };
  }, [channel]);

  // Debug

  useEffect(() => {
    if (debug) {
      const log = (...args: any[]) => {
        console.log(...args);
      };
      pc.addEventListener('connectionstatechange', log);
      pc.addEventListener('datachannel', log);
      pc.addEventListener('icecandidate', log);
      pc.addEventListener('icecandidateerror', log);
      pc.addEventListener('iceconnectionstatechange', log);
      pc.addEventListener('icegatheringstatechange', log);
      pc.addEventListener('negotiationneeded', log);
      pc.addEventListener('signalingstatechange', log);
      pc.addEventListener('statsended', log);
      pc.addEventListener('track', log);
      channel.addEventListener('open', log);
      channel.addEventListener('message', log);
      channel.addEventListener('close', log);
      channel.addEventListener('error', log);
      channel.addEventListener('bufferedamountlow', log);
      return function() {
        pc.removeEventListener('connectionstatechange', log);
        pc.removeEventListener('datachannel', log);
        pc.removeEventListener('icecandidate', log);
        pc.removeEventListener('icecandidateerror', log);
        pc.removeEventListener('iceconnectionstatechange', log);
        pc.removeEventListener('icegatheringstatechange', log);
        pc.removeEventListener('negotiationneeded', log);
        pc.removeEventListener('signalingstatechange', log);
        pc.removeEventListener('statsended', log);
        pc.removeEventListener('track', log);
        channel.removeEventListener('open', log);
        channel.removeEventListener('message', log);
        channel.removeEventListener('close', log);
        channel.removeEventListener('error', log);
        channel.removeEventListener('bufferedamountlow', log);
      };
    }
  }, [debug, pc, channel]);

  return [pcRef.current, channelRef.current, connected];
}

export default useConnection;
