import { useEffect, useRef, MutableRefObject, useState } from 'react';

function useConnection(debug: boolean): [RTCPeerConnection, boolean] {
  // Connection ref

  const pcRef: MutableRefObject<RTCPeerConnection> = useRef(
    new RTCPeerConnection({
      iceServers: [{ urls: ['stun:stunserver.org'] }],
    }),
  );
  const pc = pcRef.current;

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
      };
    }
  }, [debug, pc]);

  return [pcRef.current, connected];
}

export function useHostConnection(
  debug = false,
): [RTCPeerConnection, RTCDataChannel, boolean] {
  const [pc, connected] = useConnection(debug);

  // Channel ref

  const channelRef: MutableRefObject<RTCDataChannel> = useRef(
    pc.createDataChannel('cornhole'),
  );
  const channel = channelRef.current;

  // Debug

  useEffect(() => {
    if (debug) {
      const log = (...args: any[]) => {
        console.log(...args);
      };
      channel.addEventListener('open', log);
      channel.addEventListener('message', log);
      channel.addEventListener('close', log);
      channel.addEventListener('error', log);
      channel.addEventListener('bufferedamountlow', log);
      return function() {
        channel.removeEventListener('open', log);
        channel.removeEventListener('message', log);
        channel.removeEventListener('close', log);
        channel.removeEventListener('error', log);
        channel.removeEventListener('bufferedamountlow', log);
      };
    }
  }, [debug, channel]);

  return [pc, channel, connected];
}

export function useSideConnection(
  debug = false,
): [RTCPeerConnection, RTCDataChannel | null, boolean] {
  const [pc, connected] = useConnection(debug);
  const [_, setHasChannel] = useState(false);

  // Channel ref

  const channelRef: MutableRefObject<RTCDataChannel | null> = useRef(null);
  const channel = channelRef.current;

  useEffect(() => {
    const setChannel = (evt: RTCDataChannelEvent) => {
      console.log('received a channel and are setting it', evt.channel);
      channelRef.current = evt.channel;
      setHasChannel(true);
    };
    pc.addEventListener('datachannel', setChannel);
    return function() {
      pc.removeEventListener('datachannel', setChannel);
    };
  }, [pc]);

  // Debug

  useEffect(() => {
    if (debug && channel) {
      const log = (...args: any[]) => {
        console.log(...args);
      };
      channel.addEventListener('open', log);
      channel.addEventListener('message', log);
      channel.addEventListener('close', log);
      channel.addEventListener('error', log);
      channel.addEventListener('bufferedamountlow', log);
      return function() {
        channel.removeEventListener('open', log);
        channel.removeEventListener('message', log);
        channel.removeEventListener('close', log);
        channel.removeEventListener('error', log);
        channel.removeEventListener('bufferedamountlow', log);
      };
    }
  }, [debug, channel]);

  return [pc, channelRef.current, connected];
}
