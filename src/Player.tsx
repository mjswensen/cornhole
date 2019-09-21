import React, { useState } from 'react';
import useConnection from './useConnection';

const ICE_GATHERING_TIMEOUT = 2000;
async function init(
  pc: RTCPeerConnection,
  encodedOffer: string,
): Promise<RTCSessionDescription | null> {
  const iceGatheringComplete = new Promise(resolve => {
    pc.addEventListener('icegatheringstatechange', () => {
      if (pc.iceGatheringState === 'complete') {
        resolve();
      }
    });
  });

  const iceGatheringTimeout = new Promise(resolve => {
    setTimeout(() => resolve(), ICE_GATHERING_TIMEOUT);
  });

  const signalingStatusComplete = new Promise(resolve => {
    pc.addEventListener('signalingstatechange', () => {
      if (pc.signalingState === 'stable') {
        resolve();
      }
    });
  });

  pc.setRemoteDescription(JSON.parse(atob(encodedOffer)));
  pc.createAnswer().then(answer => {
    pc.setLocalDescription(answer);
  });

  await Promise.all([
    Promise.race([iceGatheringComplete, iceGatheringTimeout]),
    signalingStatusComplete,
  ]);
  return pc.localDescription;
}

const Player: React.FC<{ encodedOffer: string }> = ({ encodedOffer }) => {
  const [answer, setAnswer] = useState<string>();

  const [pc, channel, connected] = useConnection(true);

  return (
    <div>
      <p>Player time!</p>
      <button
        onClick={() =>
          init(pc, encodedOffer).then(description =>
            setAnswer(btoa(JSON.stringify(description))),
          )
        }
      >
        Generate answer
      </button>
      {answer && <textarea readOnly value={answer} />}
      <h1>Connected: {connected.toString()}</h1>
    </div>
  );
};

export default Player;
