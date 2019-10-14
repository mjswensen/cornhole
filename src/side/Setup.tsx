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
    <section className="container">
      <div className="jumbotron">
        <h1 className="display-3">
          Cornhole
          <span className="ml-3" role="img" aria-label="corn and hole emoji">
            🌽🕳
          </span>
        </h1>
      </div>
      {connected ? (
        <div className="alert alert-success">
          <h4 className="alert-heading">Connected!</h4>
          <hr />
          <p className="mb-0">Waiting for other side to connect...</p>
        </div>
      ) : answer ? (
        <div>
          <p>Paste this code into the game host:</p>
          <textarea className="form-control" readOnly value={answer} />
        </div>
      ) : (
        <button
          className="btn btn-primary btn-lg"
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
