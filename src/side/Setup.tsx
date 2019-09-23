import React, { useState } from 'react';

async function init(
  pc: RTCPeerConnection,
  encodedOffer: string,
): Promise<RTCSessionDescription | null> {
  const ICE_GATHERING_TIMEOUT = 2000;

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

const Setup: React.FC<{
  pc: RTCPeerConnection;
  encodedOffer: string;
  connected: boolean;
}> = ({ pc, encodedOffer, connected }) => {
  const [answer, setAnswer] = useState<string>();
  return (
    <section className="ui center aligned text container">
      <h1 className="ui header">Cornhole</h1>
      {connected ? (
        <div className="ui success icon message">
          <i className="check icon"></i>
          <div className="content">
            <div className="header">Connected!</div>
            <p>Waiting for other side to connect...</p>
          </div>
        </div>
      ) : answer ? (
        <div className="ui form">
          <p>Paste this code into the game host:</p>
          <textarea readOnly value={answer} />
        </div>
      ) : (
        <button
          className="massive primary ui button"
          onClick={() =>
            init(pc, encodedOffer).then(description =>
              setAnswer(btoa(JSON.stringify(description))),
            )
          }
        >
          Join game
        </button>
      )}
    </section>
  );
};

export default Setup;
