import React, { useState } from 'react';
import useConnection from './useConnection';

const ICE_GATHERING_TIMEOUT = 2000;

const Player: React.FC<{ encodedOffer: string }> = ({ encodedOffer }) => {
  const [answer, setAnswer] = useState<string>();

  const pc = useConnection(true);

  async function init() {
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
    ]).then(() => {
      const { localDescription: description } = pc;
      setAnswer(btoa(JSON.stringify(description)));
    });
  }
  return (
    <div>
      <p>Player time!</p>
      <button onClick={init}>Generate answer</button>
      {answer && <textarea readOnly value={answer} />}
    </div>
  );
};

export default Player;
