import { useEffect, useRef, MutableRefObject, useState } from 'react';

export function useConnection(
  channelId: number,
  debug: boolean = false,
): [RTCPeerConnection, RTCDataChannel, boolean] {
  // Connection ref

  const pcRef: MutableRefObject<RTCPeerConnection | null> = useRef(null);
  function getPc(): RTCPeerConnection {
    if (pcRef.current === null) {
      pcRef.current = new RTCPeerConnection({
        iceServers: [{ urls: ['stun:stunserver.org'] }],
      });
    }
    return pcRef.current;
  }
  const pc = getPc();

  // Channel ref

  const channelRef: MutableRefObject<RTCDataChannel | null> = useRef(null);
  function getChannel(): RTCDataChannel {
    if (channelRef.current === null) {
      channelRef.current = pc.createDataChannel('cornhole', {
        negotiated: true,
        id: channelId,
      });
    }
    return channelRef.current;
  }
  const channel = getChannel();

  // Connected state

  const [connected, setConnected] = useState(false);
  useEffect(() => {
    const connectionStateChange = () => {
      setConnected(pc.connectionState === 'connected');
    };
    pc.addEventListener('connectionstatechange', connectionStateChange);
    return () => {
      pc.removeEventListener('connectionstatechange', connectionStateChange);
    };
  }, [pc]);

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

  return [pc, channel, connected];
}
