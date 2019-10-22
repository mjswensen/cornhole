import React, { useState } from 'react';
import Alert from '../common/Alert';
import Button from '../common/Button';

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
    <section className="flex items-center flex-col justify-center min-h-full">
      <h1 className="font-display text-6xl text-center mb-4">Cornhole</h1>
      {connected ? (
        <Alert heading="Connected!">Waiting for other side to connect...</Alert>
      ) : answer ? (
        <div className="rounded border border-gray-7 bg-gray-1 p-3">
          <p className="mb-3">Paste this response code into the game host:</p>
          <textarea
            className="bg-gray-0 mt-2 border border-gray-7 rounded w-full"
            readOnly
            value={answer}
          />
        </div>
      ) : (
        <Button
          onClick={() =>
            init(pc, encodedOffer).then(description =>
              setAnswer(btoa(JSON.stringify(description))),
            )
          }
        >
          Join game
        </Button>
      )}
    </section>
  );
};

export default Setup;
