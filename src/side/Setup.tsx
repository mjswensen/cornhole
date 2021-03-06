import React, { useState } from 'react';
import Alert from '../common/Alert';
import Button from '../common/Button';
import { encode } from '../common/answer';
import QR from '../common/QR';
import FakeLoading from '../common/FakeLoading';

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

  await Promise.all([iceGatheringComplete, signalingStatusComplete]);
  return pc.localDescription;
}

const Setup: React.FC<{
  pc: RTCPeerConnection;
  encodedOffer: string;
  connected: boolean;
}> = ({ pc, encodedOffer, connected }) => {
  const [answer, setAnswer] = useState<string>();
  const [initializing, setInitializing] = useState(false);

  return (
    <section className="flex items-center flex-col justify-center min-h-full p-4">
      <h1 className="font-display text-6xl text-center mb-4">Cornhole</h1>
      {connected ? (
        <Alert heading="Connected!">Waiting for other side to connect...</Alert>
      ) : answer ? (
        <div className="rounded border border-gray-7 bg-gray-1">
          <QR className="rounded-t" data={answer} alt="Response code" />
          <p className="p-3">Scan this response code into the game host.</p>
        </div>
      ) : (
        <>
          <Button
            disabled={initializing}
            onClick={() => {
              init(pc, encodedOffer).then(description => {
                if (description) {
                  setAnswer(encode(description));
                }
              });
              setInitializing(true);
            }}
          >
            Join game
          </Button>
          <div className="mt-1 h-1">
            {initializing ? <FakeLoading /> : null}
          </div>
        </>
      )}
    </section>
  );
};

export default Setup;
