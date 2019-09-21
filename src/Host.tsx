import React, { useState } from 'react';
import QRLink from './QRLink';
import useConnection from './useConnection';

async function init(
  pc: RTCPeerConnection,
): Promise<RTCSessionDescription | null> {
  const ICE_GATHERING_TIMEOUT = 2000;

  pc.createDataChannel('testing');

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
      if (pc.signalingState === 'have-local-offer') {
        resolve();
      }
    });
  });

  pc.createOffer().then(offer => {
    pc.setLocalDescription(offer);
  });

  await Promise.all([
    Promise.race([iceGatheringComplete, iceGatheringTimeout]),
    signalingStatusComplete,
  ]);

  return pc.localDescription;
}

const Host: React.FC = () => {
  const [offerUrl, setOfferUrl] = useState<string>();

  const pc = useConnection(true);

  return (
    <section>
      <p>Host</p>
      <button
        onClick={() =>
          init(pc).then(description =>
            setOfferUrl(
              `${window.location.href}player/${btoa(
                JSON.stringify(description),
              )}`,
            ),
          )
        }
      >
        Start new game!
      </button>
      {offerUrl && (
        <>
          <QRLink url={offerUrl} />
          <p>Paste answer here:</p>
          <textarea
            onChange={evt => {
              const answer = JSON.parse(atob(evt.target.value));
              pc.setRemoteDescription(answer);
            }}
          ></textarea>
        </>
      )}
    </section>
  );
};

export default Host;
